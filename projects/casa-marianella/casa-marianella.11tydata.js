import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Optional: Define custom captions for specific images
const captions = {
  'photo-1.jpg': 'Interior detail',
  'photo-2.avif': 'Exterior view'
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

// Find header image (any file starting with "header")
const headerFile = imageFiles.find(file => file.toLowerCase().startsWith('header'));

// Get all other images (exclude header)
const galleryFiles = imageFiles.filter(file => file !== headerFile);

// Build header image object
const headerImage = headerFile ? {
  src: `projects/${projectFolder}/${headerFile}`,
  alt: ''
} : null;

// Build gallery images array with captions
const images = galleryFiles.map(file => ({
  src: `projects/${projectFolder}/${file}`,
  caption: captions[file] || path.basename(file, path.extname(file)).replace(/[-_]/g, ' ')
}));

// Export the data
export default {
  headerImage: headerImage,
  images: images
};
