import fs from 'fs';
import path from 'path';

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];

export default function() {
  return {
    eleventyComputed: {
      permalink(data) {
        // If the page is in `draft:true` mode, don't write it to disk...
        if (data.draft) {
          return {};
        }
        // Return the original value (which could be `false`, or a custom value,
        // or default empty string).
        return data.permalink;
      },
      eleventyExcludeFromCollections(data) {
        // If the page is in `draft:true` mode, or has `permalink:false` exclude
        // it from any collections since it shouldn't be visible anywhere.
        if (data.draft || data.permalink === false) {
          return true;
        }
        return data.eleventyExcludeFromCollections;
      },

      // Auto-discover header image from project folder
      headerImage(data) {
        // Skip if already defined in frontmatter
        if (data.headerImage) {
          return data.headerImage;
        }

        const projectDir = path.dirname(data.page.inputPath);

        try {
          const files = fs.readdirSync(projectDir);
          const headerFile = files.find(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext) && file.toLowerCase().startsWith('header');
          });

          if (headerFile) {
            // Build path relative to project root (for Eleventy's image plugin)
            const relativePath = path.relative('.', path.join(projectDir, headerFile));
            return { src: relativePath, alt: data.title || '' };
          }
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return null;
      },

      // Auto-discover gallery images from project folder
      images(data) {
        // Skip if already defined in frontmatter
        if (data.images && data.images.length > 0) {
          return data.images;
        }

        const projectDir = path.dirname(data.page.inputPath);

        try {
          const files = fs.readdirSync(projectDir);
          const imageFiles = files
            .filter(file => {
              const ext = path.extname(file).toLowerCase();
              return imageExtensions.includes(ext)
                && !file.toLowerCase().startsWith('header')
                && !file.toLowerCase().startsWith('drawing-')
                && !file.toLowerCase().startsWith('toolkit-');
            })
            .sort();

          return imageFiles.map(file => {
            const relativePath = path.relative('.', path.join(projectDir, file));
            // Generate caption from filename: "photo-1.jpg" → "photo 1"
            const caption = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
            return { src: relativePath, caption };
          });
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return [];
      },

      // Auto-discover drawing images (files starting with "drawing-") from project folder
      drawings(data) {
        if (data.drawings && data.drawings.length > 0) {
          return data.drawings;
        }

        const projectDir = path.dirname(data.page.inputPath);

        try {
          const files = fs.readdirSync(projectDir);
          const drawingFiles = files
            .filter(file => {
              const ext = path.extname(file).toLowerCase();
              return imageExtensions.includes(ext) && file.toLowerCase().startsWith('drawing-');
            })
            .sort();

          return drawingFiles.map(file => {
            const relativePath = path.relative('.', path.join(projectDir, file));
            const caption = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
            return { src: relativePath, caption };
          });
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return [];
      },

      // Auto-discover toolkit files (files starting with "toolkit-") from project folder
      toolkitFiles(data) {
        if (data.toolkitFiles && data.toolkitFiles.length > 0) {
          return data.toolkitFiles;
        }

        const projectDir = path.dirname(data.page.inputPath);

        try {
          const files = fs.readdirSync(projectDir);
          const toolkitFiles = files
            .filter(file => file.toLowerCase().startsWith('toolkit-'))
            .sort();

          return toolkitFiles.map(file => {
            const ext = path.extname(file).slice(1).toUpperCase();
            // Strip "toolkit-" prefix, replace hyphens/underscores with spaces
            // e.g. "toolkit-LOWDO-wolf-creek-ranch-drawings.pdf" → "LOWDO wolf creek ranch drawings"
            const title = path.basename(file, path.extname(file))
              .replace(/^toolkit-/i, '')
              .replace(/[-_]/g, ' ');
            const relativePath = path.relative('.', path.join(projectDir, file));
            return {
              filename: file,
              title,
              format: ext,
              url: `/${relativePath}`
            };
          });
        } catch (e) {
          // Folder doesn't exist yet or can't be read
        }

        return [];
      }
    },
    layout: "layouts/project.njk",
    // Set a default position for all projects
    position: 999,
    tags: [
      "project"
    ],
  }
}
