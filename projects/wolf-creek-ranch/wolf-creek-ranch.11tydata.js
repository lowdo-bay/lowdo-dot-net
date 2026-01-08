import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Optional: Define custom captions for specific images
const captions = {
  '123_Wolf-Creek_DH_PRINT_001': 'Wide view',
  '123_Wolf-Creek_DH_WEB_011': 'Secondary bathroom on subfloor'
};

// Get all files in this directory
const files = fs.readdirSync(__dirname);

// Filter for image files only
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
});

// Get the folder name
const folderParts = __dirname.split(path.sep);
const projectFolder = folderParts[folderParts.length - 1];

// Build the images array with captions
const images = imageFiles.map(file => ({
  src: `projects/${projectFolder}/${file}`,
  alt: captions[file] || path.basename(file, path.extname(file)).replace(/[-_]/g, ' ')
}));

// Export the data
export default {
  images: images
};
