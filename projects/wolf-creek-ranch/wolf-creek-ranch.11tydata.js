import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  images: () => {
    // Get all files in this directory
    const files = fs.readdirSync(__dirname);
    
    // Filter for image files only (not the .md or .js files)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    // Get the folder name from __dirname
    const folderParts = __dirname.split(path.sep);
    const projectFolder = folderParts[folderParts.length - 1];
    
    // Return images array with full paths
    return imageFiles.map(file => ({
      src: `projects/${projectFolder}/${file}`,
      alt: path.basename(file, path.extname(file)).replace(/[-_]/g, ' ')
    }));
  }
};
