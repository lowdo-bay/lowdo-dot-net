// One-time migration: move a project's images + design files to Cloudflare R2.
//
// For each image it generates a responsive size ladder (WebP + JPEG) with sharp and
// uploads the original + every variant to R2. For design files (toolkit-*) it uploads
// the original as-is. It then writes structured file records into the entry's .md
// frontmatter, so the build reads from R2 instead of scanning the local folder.
//
// Local files are left in place (the display code falls back to them until cleanup),
// so this is safe to run incrementally — one project at a time.
//
// Usage:
//   node scripts/migrate-to-r2.mjs <project-folder>        # migrate one project
//   node scripts/migrate-to-r2.mjs <project-folder> --dry-run   # plan only, no uploads/writes
//
// Example:
//   node scripts/migrate-to-r2.mjs 201202_alamo-st
//
// Requires R2_* vars in your local .env (see .env.example).

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import matter from 'gray-matter';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// --- Config -----------------------------------------------------------------

const WIDTHS = [640, 1080, 1800, 2400];   // size ladder (skips widths larger than the source)
const FORMATS = ['webp', 'jpeg'];          // variant formats, matches the <picture> output
const QUALITY = { webp: 75, jpeg: 80 };
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const RASTER_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.avif']; // safe to resize with sharp

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
};
const mimeFor = (extOrFmt) => {
  const e = extOrFmt.startsWith('.') ? extOrFmt : '.' + extOrFmt;
  return MIME[e.toLowerCase()] || 'application/octet-stream';
};

// --- Args + env -------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const projectArg = args.find((a) => !a.startsWith('--'));

if (!projectArg) {
  console.error('Usage: node scripts/migrate-to-r2.mjs <project-folder> [--dry-run]');
  process.exit(1);
}

const REQUIRED = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_S3_ENDPOINT', 'R2_PUBLIC_BASE_URL'];
if (!dryRun) {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Missing env vars (add them to .env): ' + missing.join(', '));
    process.exit(1);
  }
}

const BUCKET = process.env.R2_BUCKET;
const s3 = dryRun ? null : new S3Client({
  region: 'auto',
  endpoint: (process.env.R2_S3_ENDPOINT || '').replace(/\/$/, ''),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// --- Helpers ----------------------------------------------------------------

const projectDir = path.join('entries', 'projects', projectArg);
if (!fs.existsSync(projectDir)) {
  console.error(`Project folder not found: ${projectDir}`);
  process.exit(1);
}

// Relative POSIX key from repo root, e.g. entries/projects/<slug>/<file>
const keyFor = (file) => path.posix.join('entries', 'projects', projectArg, file);
// Variant key: "<dir>/<basename>-<width>.<format>"
const variantKey = (file, width, fmt) => {
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  return path.posix.join('entries', 'projects', projectArg, `${base}-${width}.${fmt}`);
};

let uploadCount = 0;
async function putObject(key, body, contentType) {
  if (dryRun) { console.log(`  [dry-run] would upload ${key} (${contentType})`); uploadCount++; return; }
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: body, ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  uploadCount++;
}

const caption = (file) => path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');

// Generate the size ladder for one image and upload original + variants.
// Returns the frontmatter record { src, width, height, r2, widths, formats }.
async function migrateImage(file) {
  const absPath = path.join(projectDir, file);
  const ext = path.extname(file).toLowerCase();
  const key = keyFor(file);

  // Upload the original (full-res, used for lightbox + as the <img> fallback).
  await putObject(key, fs.readFileSync(absPath), mimeFor(ext));

  // Non-raster (gif/svg): keep the original only, no resized variants.
  if (!RASTER_EXT.includes(ext)) {
    return { src: key, r2: true, widths: [], formats: [] };
  }

  const meta = await sharp(absPath).metadata();
  const srcW = meta.width || 0;
  const srcH = meta.height || 0;
  const widths = WIDTHS.filter((w) => w <= srcW);
  if (widths.length === 0 && srcW > 0) widths.push(srcW); // tiny source: at least one variant

  for (const w of widths) {
    for (const fmt of FORMATS) {
      const buf = await sharp(absPath)
        .resize({ width: w, withoutEnlargement: true })
        .toFormat(fmt, { quality: QUALITY[fmt] })
        .toBuffer();
      await putObject(variantKey(file, w, fmt), buf, mimeFor(fmt));
    }
  }
  return { src: key, width: srcW, height: srcH, r2: true, widths, formats: FORMATS };
}

// --- Classify the folder ----------------------------------------------------

const allFiles = fs.readdirSync(projectDir).filter((f) => fs.statSync(path.join(projectDir, f)).isFile());
const lower = (f) => f.toLowerCase();
const isImage = (f) => IMAGE_EXT.includes(path.extname(f).toLowerCase());

const headerFile = allFiles.find((f) => isImage(f) && lower(f).startsWith('header'));
const featureFile = allFiles.find((f) => isImage(f) && lower(f).startsWith('featured'));
const drawingFiles = allFiles.filter((f) => isImage(f) && lower(f).startsWith('drawing-')).sort();
const toolkitFiles = allFiles.filter((f) => lower(f).startsWith('toolkit-')).sort();
const galleryFiles = allFiles.filter((f) =>
  isImage(f) &&
  !lower(f).startsWith('header') &&
  !lower(f).startsWith('featured') &&
  !lower(f).startsWith('drawing-') &&
  !lower(f).startsWith('toolkit-')
).sort();

// --- Run --------------------------------------------------------------------

console.log(`\nMigrating ${projectDir}${dryRun ? '  (DRY RUN)' : ''}`);
console.log(`  header:${headerFile ? 1 : 0} feature:${featureFile ? 1 : 0} gallery:${galleryFiles.length} drawings:${drawingFiles.length} toolkit:${toolkitFiles.length}\n`);

// Locate the entry's markdown file (same name as the folder, or the only .md present).
const mdName = fs.existsSync(path.join(projectDir, `${projectArg}.md`))
  ? `${projectArg}.md`
  : allFiles.find((f) => f.endsWith('.md'));
if (!mdName) { console.error('No .md entry file found in the project folder.'); process.exit(1); }
const mdPath = path.join(projectDir, mdName);
const parsed = matter(fs.readFileSync(mdPath, 'utf8'));
const title = parsed.data.title || '';

const records = {};

if (headerFile) {
  console.log(`header: ${headerFile}`);
  records.headerImage = { ...(await migrateImage(headerFile)), alt: title };
}
if (featureFile) {
  console.log(`feature: ${featureFile}`);
  records.featureImage = { ...(await migrateImage(featureFile)), alt: title };
}
if (galleryFiles.length) {
  records.images = [];
  for (const f of galleryFiles) {
    console.log(`gallery: ${f}`);
    records.images.push({ ...(await migrateImage(f)), caption: caption(f) });
  }
}
if (drawingFiles.length) {
  records.drawings = [];
  for (const f of drawingFiles) {
    console.log(`drawing: ${f}`);
    records.drawings.push({ ...(await migrateImage(f)), caption: caption(f) });
  }
}
if (toolkitFiles.length) {
  records.toolkitFiles = [];
  for (const f of toolkitFiles) {
    console.log(`toolkit: ${f}`);
    await putObject(keyFor(f), fs.readFileSync(path.join(projectDir, f)), mimeFor(path.extname(f)));
    records.toolkitFiles.push({
      filename: f,
      title: path.basename(f, path.extname(f)).replace(/^toolkit-/i, '').replace(/[-_]/g, ' '),
      format: path.extname(f).slice(1).toUpperCase(),
      key: keyFor(f), // 11ty prepends R2_PUBLIC_BASE_URL → url
    });
  }
}

// --- Write frontmatter ------------------------------------------------------

const newData = { ...parsed.data, ...records };
if (dryRun) {
  console.log('\n[dry-run] frontmatter records that would be written:\n');
  console.log(JSON.stringify(records, null, 2));
  console.log(`\n[dry-run] ${uploadCount} objects would be uploaded.`);
} else {
  fs.writeFileSync(mdPath, matter.stringify(parsed.content, newData));
  console.log(`\n✅ Uploaded ${uploadCount} objects to R2 and wrote records to ${mdPath}`);
}
