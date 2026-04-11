/**
 * One-time migration: add `type:` frontmatter field to all entries,
 * and move non-project entries from their type-named folders into entries/other/.
 *
 * Run: node scripts/migrate-types.mjs
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ENTRIES_DIR = path.resolve('./entries');

const folderToType = {
  'projects':    'project',
  'awards':      'award',
  'exhibitions': 'exhibition',
  'features':    'feature',
  'lectures':    'lecture',
  'news':        'news',
  'staff':       'staff',
};

let migrated = 0;
let skipped = 0;

for (const [folder, typeName] of Object.entries(folderToType)) {
  const folderPath = path.join(ENTRIES_DIR, folder);
  if (!fs.existsSync(folderPath)) continue;

  const entryDirs = fs.readdirSync(folderPath).filter(name => {
    return fs.statSync(path.join(folderPath, name)).isDirectory();
  });

  for (const entryDir of entryDirs) {
    const entryPath = path.join(folderPath, entryDir);
    const mdFile = path.join(entryPath, `${entryDir}.md`);

    if (!fs.existsSync(mdFile)) {
      console.log(`  SKIP (no .md): ${folder}/${entryDir}`);
      skipped++;
      continue;
    }

    // Add type: frontmatter field
    const raw = fs.readFileSync(mdFile, 'utf-8');
    const parsed = matter(raw);

    if (parsed.data.type === typeName) {
      console.log(`  already set: ${folder}/${entryDir}`);
      skipped++;
    } else {
      parsed.data.type = typeName;
      // Remove null/undefined fields
      Object.keys(parsed.data).forEach(k => {
        if (parsed.data[k] === null || parsed.data[k] === undefined) delete parsed.data[k];
      });
      const updated = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(mdFile, updated, 'utf-8');
      console.log(`  type: ${typeName}  →  ${folder}/${entryDir}`);
      migrated++;
    }

    // Move non-project entries to entries/other/
    if (typeName !== 'project') {
      const otherDir = path.join(ENTRIES_DIR, 'other');
      if (!fs.existsSync(otherDir)) fs.mkdirSync(otherDir, { recursive: true });

      const destPath = path.join(otherDir, entryDir);
      if (fs.existsSync(destPath)) {
        console.log(`  SKIP move (already in other/): ${entryDir}`);
      } else {
        fs.renameSync(entryPath, destPath);
        console.log(`  moved → other/${entryDir}`);
      }
    }
  }

  // Remove the now-empty type folder (non-project only)
  if (typeName !== 'project') {
    const remaining = fs.readdirSync(folderPath).filter(name => {
      return fs.statSync(path.join(folderPath, name)).isDirectory();
    });
    if (remaining.length === 0) {
      // Remove any leftover files (like _template entries that weren't moved)
      const allFiles = fs.readdirSync(folderPath);
      if (allFiles.length === 0) {
        fs.rmdirSync(folderPath);
        console.log(`  removed empty folder: entries/${folder}/`);
      } else {
        console.log(`  folder not empty (${allFiles.length} items remain): entries/${folder}/`);
      }
    } else {
      console.log(`  folder still has ${remaining.length} subdirs: entries/${folder}/`);
    }
  }
}

console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}`);
