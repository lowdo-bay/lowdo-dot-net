import fs from 'fs';
import path from 'path';

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];

// Map folder names to entry types
const folderToType = {
  'projects': 'project',
  'news': 'news',
  'lectures': 'lecture',
  'awards': 'award',
  'features': 'feature',
  'staff': 'staff',
  'exhibitions': 'exhibition'
};

export default function() {
  return {
    eleventyComputed: {
      // Auto-detect entry type from folder path
      entryType(data) {
        const inputPath = data.page.inputPath;
        const pathParts = inputPath.split('/');
        const entriesIndex = pathParts.indexOf('entries');
        if (entriesIndex >= 0 && pathParts[entriesIndex + 1]) {
          const folder = pathParts[entriesIndex + 1];
          return folderToType[folder] || 'other';
        }
        return 'other';
      },

      // Set layout based on entry type
      layout(data) {
        // Determine entry type from folder path
        const inputPath = data.page.inputPath;
        const pathParts = inputPath.split('/');
        const entriesIndex = pathParts.indexOf('entries');
        let entryType = 'other';
        if (entriesIndex >= 0 && pathParts[entriesIndex + 1]) {
          const folder = pathParts[entriesIndex + 1];
          entryType = folderToType[folder] || 'other';
        }

        // Only projects get a layout (and thus a page)
        if (entryType === 'project') {
          return 'layouts/project.njk';
        }

        // Other entry types don't need a layout
        return false;
      },

      permalink(data) {
        // If the page is in `draft:true` mode, don't write it to disk
        if (data.draft) {
          return false;
        }

        // Determine entry type from folder path
        const inputPath = data.page.inputPath;
        const pathParts = inputPath.split('/');
        const entriesIndex = pathParts.indexOf('entries');
        let entryType = 'other';
        if (entriesIndex >= 0 && pathParts[entriesIndex + 1]) {
          const folder = pathParts[entriesIndex + 1];
          entryType = folderToType[folder] || 'other';
        }

        // Projects get their own pages
        if (entryType === 'project') {
          return `/project/${data.page.fileSlug}/index.html`;
        }

        // Other entry types don't get individual pages (only appear in index)
        return false;
      },

      eleventyExcludeFromCollections(data) {
        // If the page is in `draft:true` mode, exclude it from collections
        if (data.draft) {
          return true;
        }
        return data.eleventyExcludeFromCollections;
      },

      // Auto-discover thumbnail image from entry folder
      thumbnail(data) {
        // Skip if already defined in frontmatter
        if (data.thumbnail) {
          return data.thumbnail;
        }

        const entryDir = path.dirname(data.page.inputPath);

        try {
          const files = fs.readdirSync(entryDir);
          // Look for header.*, thumb.*, or first image
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
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return null;
      },

      // Auto-discover header image (for project detail pages)
      headerImage(data) {
        // Skip if already defined in frontmatter
        if (data.headerImage) {
          return data.headerImage;
        }

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
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return null;
      },

      // Auto-discover gallery images (for project detail pages)
      images(data) {
        // Determine entry type from folder path
        const inputPath = data.page.inputPath;
        const pathParts = inputPath.split('/');
        const entriesIndex = pathParts.indexOf('entries');
        let entryType = 'other';
        if (entriesIndex >= 0 && pathParts[entriesIndex + 1]) {
          const folder = pathParts[entriesIndex + 1];
          entryType = folderToType[folder] || 'other';
        }

        // Only projects have gallery images
        if (entryType !== 'project') {
          return [];
        }

        // Skip if already defined in frontmatter
        if (data.images && data.images.length > 0) {
          return data.images;
        }

        const entryDir = path.dirname(inputPath);

        try {
          const files = fs.readdirSync(entryDir);
          const imageFiles = files
            .filter(file => {
              const ext = path.extname(file).toLowerCase();
              return imageExtensions.includes(ext)
                && !file.toLowerCase().startsWith('header')
                && !file.toLowerCase().startsWith('drawing-');
            })
            .sort();

          return imageFiles.map(file => {
            const relativePath = path.relative('.', path.join(entryDir, file));
            // Generate caption from filename: "photo-1.jpg" → "photo 1"
            const caption = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
            return { src: relativePath, caption };
          });
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return [];
      },

      // Auto-discover drawing images (for project detail pages)
      drawings(data) {
        // Determine entry type from folder path
        const inputPath = data.page.inputPath;
        const pathParts = inputPath.split('/');
        const entriesIndex = pathParts.indexOf('entries');
        let entryType = 'other';
        if (entriesIndex >= 0 && pathParts[entriesIndex + 1]) {
          const folder = pathParts[entriesIndex + 1];
          entryType = folderToType[folder] || 'other';
        }

        // Only projects have drawings
        if (entryType !== 'project') {
          return [];
        }

        // Skip if already defined in frontmatter
        if (data.drawings && data.drawings.length > 0) {
          return data.drawings;
        }

        const entryDir = path.dirname(inputPath);

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
            // Generate caption from filename: "drawing-plan_1.jpg" → "drawing plan 1"
            const caption = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
            return { src: relativePath, caption };
          });
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return [];
      }
    },

    // Tag all entries for unified collection
    tags: ["entry"],

    // Default position for sorting
    position: 999
  };
}
