import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];

// Resolve entry type: prefer frontmatter `type` field, fall back to folder name
function resolveEntryType(data) {
  if (data.type) return data.type;
  // Fallback: infer from folder path (for any entries not yet migrated)
  const inputPath = data.page.inputPath;
  const pathParts = inputPath.split('/');
  const entriesIndex = pathParts.indexOf('entries');
  if (entriesIndex >= 0 && pathParts[entriesIndex + 1]) {
    const folder = pathParts[entriesIndex + 1];
    if (folder === 'projects') return 'project';
  }
  return 'other';
}

export default function() {
  return {
    eleventyComputed: {
      // Entry type comes from `type:` frontmatter field
      entryType(data) {
        return resolveEntryType(data);
      },

      // Set layout based on entry type
      layout(data) {
        if (resolveEntryType(data) === 'project') {
          return 'layouts/project.njk';
        }
        return false;
      },

      permalink(data) {
        if (data.draft) return false;
        if (resolveEntryType(data) === 'project') {
          return `/project/${data.page.fileSlug}/index.html`;
        }
        return false;
      },

      // Auto-discover thumbnail image from entry folder
      thumbnail(data) {
        if (data.thumbnail) return data.thumbnail;
        const entryDir = path.dirname(data.page.inputPath);
        try {
          const files = fs.readdirSync(entryDir);
          const thumbFile = files.find(file => {
            const ext = path.extname(file).toLowerCase();
            const name = path.basename(file, ext).toLowerCase();
            return imageExtensions.includes(ext) &&
                   (name.startsWith('header') || name.startsWith('thumb'));
          }) || files.find(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
          });
          if (thumbFile) {
            const relativePath = path.relative('.', path.join(entryDir, thumbFile));
            return { src: relativePath, alt: data.title || '' };
          }
        } catch (e) {}
        return null;
      },

      // Auto-discover header image (for project detail pages)
      headerImage(data) {
        if (data.headerImage) return data.headerImage;
        const entryDir = path.dirname(data.page.inputPath);
        try {
          const files = fs.readdirSync(entryDir);
          const headerFile = files.find(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext) && file.toLowerCase().startsWith('header');
          });
          if (headerFile) {
            const relativePath = path.relative('.', path.join(entryDir, headerFile));
            return { src: relativePath, alt: data.title || '' };
          }
        } catch (e) {}
        return null;
      },

      // Auto-discover featured image (for homepage featured projects section)
      featureImage(data) {
        if (data.featureImage) return data.featureImage;
        const entryDir = path.dirname(data.page.inputPath);
        try {
          const files = fs.readdirSync(entryDir);
          const featureFile = files.find(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext) && file.toLowerCase().startsWith('featured');
          });
          if (featureFile) {
            const relativePath = path.relative('.', path.join(entryDir, featureFile));
            return { src: relativePath, alt: data.title || '' };
          }
        } catch (e) {}
        return null;
      },

      headerImageOrientation(data) {
        if (!data.headerImage) return null;
        try {
          const dims = sizeOf(data.headerImage.src);
          if (dims.width > dims.height) return 'landscape';
          if (dims.width < dims.height) return 'portrait';
          return 'square';
        } catch (e) {
          return null;
        }
      },

      headerImageRatio(data) {
        if (!data.headerImage) return null;
        try {
          const dims = sizeOf(data.headerImage.src);
          return dims.height / dims.width;
        } catch (e) {
          return null;
        }
      },

      // Auto-discover gallery images (projects only)
      images(data) {
        if (resolveEntryType(data) !== 'project') return [];
        if (data.images && data.images.length > 0) return data.images;
        const entryDir = path.dirname(data.page.inputPath);
        try {
          const files = fs.readdirSync(entryDir);
          const imageFiles = files
            .filter(file => {
              const ext = path.extname(file).toLowerCase();
              return imageExtensions.includes(ext)
                && !file.toLowerCase().startsWith('header')
                && !file.toLowerCase().startsWith('featured')
                && !file.toLowerCase().startsWith('drawing-')
                && !file.toLowerCase().startsWith('toolkit-');
            })
            .sort();
          return imageFiles.map(file => {
            const relativePath = path.relative('.', path.join(entryDir, file));
            const caption = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
            return { src: relativePath, caption };
          });
        } catch (e) {}
        return [];
      },

      // Auto-discover drawing images (projects only)
      drawings(data) {
        if (resolveEntryType(data) !== 'project') return [];
        if (data.drawings && data.drawings.length > 0) return data.drawings;
        const entryDir = path.dirname(data.page.inputPath);
        try {
          const files = fs.readdirSync(entryDir);
          const drawingFiles = files
            .filter(file => {
              const ext = path.extname(file).toLowerCase();
              return imageExtensions.includes(ext) && file.toLowerCase().startsWith('drawing-');
            })
            .sort();
          return drawingFiles.map(file => {
            const relativePath = path.relative('.', path.join(entryDir, file));
            const caption = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
            return { src: relativePath, caption };
          });
        } catch (e) {}
        return [];
      },

      // Auto-discover toolkit files (projects only)
      toolkitFiles(data) {
        if (resolveEntryType(data) !== 'project') return [];
        if (data.toolkitFiles && data.toolkitFiles.length > 0) return data.toolkitFiles;
        const entryDir = path.dirname(data.page.inputPath);
        try {
          const files = fs.readdirSync(entryDir);
          const toolkitFiles = files
            .filter(file => file.toLowerCase().startsWith('toolkit-'))
            .sort();
          return toolkitFiles.map(file => {
            const ext = path.extname(file).slice(1).toUpperCase();
            const title = path.basename(file, path.extname(file))
              .replace(/^toolkit-/i, '')
              .replace(/[-_]/g, ' ');
            const relativePath = path.relative('.', path.join(entryDir, file));
            return { filename: file, title, format: ext, url: `/${relativePath}` };
          });
        } catch (e) {}
        return [];
      }
    },

    // Tag all entries for unified collection
    tags: ["entry"],

    // Default position for sorting
    position: 999
  };
}
