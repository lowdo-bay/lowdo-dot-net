# Image Guide

Best practices for naming, uploading, and optimizing images.

---

## Uploading Images

You can upload images in two ways:

### Option 1: GitHub Web Upload (Recommended)

**No software needed!** Upload directly on GitHub.com:

1. Navigate to your entry folder: `entries/projects/your-project/` or `entries/news/your-news/`
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop your images (or click "choose your files")
4. **IMPORTANT:** Before uploading, rename files on your computer using the naming rules below
5. Write commit message: `Add images for [Entry Name]`
6. Choose "Create a new branch" if you want to preview first
7. Click "Commit changes"

**Tips:**
- You can upload multiple images at once
- All images must go in the same folder as the `.md` file
- Rename images BEFORE uploading (GitHub web doesn't let you rename)
- If you need to rename, delete and re-upload with correct name

### Option 2: Local Upload (Advanced)

If editing locally with VS Code:

1. Drag image files into your project folder in VS Code
2. Place them in the same folder as the `.md` file
3. Commit and push using git

See [Code Editor Setup](../05-tools-and-workflow/code-editor-setup.md) for local editing.

---

## Image File Naming

Use descriptive, lowercase names with hyphens:

✅ **Good:**
- `header.jpg`
- `thumb.jpg`
- `01-exterior-view.jpg`
- `02-interior-space.jpg`
- `detail-closeup.jpg`

❌ **Bad:**
- `IMG_1234.jpg` (not descriptive)
- `photo (1).jpg` (has spaces and parentheses)
- `FINAL VERSION 2.jpg` (capitals, spaces)
- `new_image.jpg` (underscores instead of hyphens)

---

## Preferred Image Names

### For Thumbnails

The system looks for these special names first:

1. `header.jpg` or `header.png` - Preferred main thumbnail
2. `thumb.jpg` or `thumb.png` - Alternative thumbnail name

If neither exists, the system will use the first image it finds alphabetically.

### For Projects (Gallery Images)

Name gallery images in order with descriptive names:

```
01-exterior-view.jpg
02-interior-space.jpg
03-detail-shot.jpg
04-community-area.jpg
```

The numbers keep them in order; the descriptions help you identify them.

---

## Where Images Go

**Projects:**
```
entries/projects/casa-marianella/
├── casa-marianella.md
├── header.jpg              ← Thumbnail
├── 01-exterior.jpg         ← Gallery image
└── 02-interior.jpg         ← Gallery image
```

**News/Awards/etc:**
```
entries/awards/emerging-voices/
├── emerging-voices.md
└── thumb.jpg               ← Optional thumbnail
```

**Never put images:**
- In the root folder
- In `_site/` (auto-generated)
- In `_includes/` or `assets/`

---

## Image Formats

### Supported Formats

✅ **Supported:**
- `.jpg` / `.jpeg` - Photos (recommended)
- `.png` - Graphics with transparency

The system automatically creates optimized versions in:
- WebP (modern, efficient format)
- AVIF (next-gen format)

Your original files remain untouched.

### Which Format to Use

**Use JPG for:**
- Photographs
- Complex images with many colors
- When file size matters

**Use PNG for:**
- Graphics with text
- Images requiring transparency
- Diagrams and illustrations

---

## Image Sizes

### No Strict Requirements

The system automatically resizes and optimizes images. However:

**Recommended:**
- **Width:** 1200-2400px for quality display
- **File size:** Under 5MB per image
- **Aspect ratio:** Whatever works for your content

**Minimum:**
- At least 800px wide for decent quality
- Thumbnails can be smaller

**Maximum:**
- Avoid uploading images over 10MB
- Extremely large files slow down uploads

---

## Image Optimization Tips

### Automatic Optimization

The system handles these automatically:
- ✅ Creating responsive sizes
- ✅ Converting to modern formats (WebP, AVIF)
- ✅ Compressing for web delivery
- ✅ Lazy loading

### Manual Optimization (Optional)

Before uploading, you can:
- Resize very large images (>4000px) to 2400px wide
- Use JPG for photos (smaller than PNG)
- Compress using tools like ImageOptim, TinyPNG, or Squoosh

**But:** The automatic system is good enough for most cases!

---

## For Projects: Gallery Behavior

All images in a project folder (except `header.*` and `thumb.*`) are added to the gallery.

**Example:**
```
entries/projects/my-project/
├── my-project.md
├── header.jpg              ← Thumbnail (not in gallery)
├── 01-wide-view.jpg        ← Gallery image 1
├── 02-entrance.jpg         ← Gallery image 2
├── 03-interior.jpg         ← Gallery image 3
└── 04-detail.jpg           ← Gallery image 4
```

The gallery displays in **alphabetical order** (that's why numbers help).

---

## For Updates: Thumbnail Only

News, awards, features, etc. only use one image:

```
entries/news/studio-expansion/
├── studio-expansion.md
└── thumb.jpg               ← Shows in index
```

Additional images in the folder won't break anything, but they won't appear anywhere.

---

## Troubleshooting

### "My image doesn't show up"

**Check:**
- ✅ Filename has no spaces (use hyphens)
- ✅ Lowercase letters
- ✅ Correct file extension (`.jpg`, `.png`)
- ✅ Image is in the same folder as the `.md` file
- ✅ File isn't corrupted (can you open it?)

### "Wrong image appears"

**Check:**
- ✅ Do you have multiple `header.*` or `thumb.*` files? (delete extras)
- ✅ Is the image you want named `header.jpg` or `thumb.jpg`?

### "Image looks blurry"

**Solutions:**
- Upload a higher resolution image
- Ensure the original is at least 1200px wide
- Check that compression didn't degrade quality too much

### "Image is too big / slow to load"

**Solutions:**
- Resize to 2400px wide maximum
- Use JPG instead of PNG for photos
- Compress with tools before uploading
- Check file size (aim for under 2MB per image)

---

## Best Practices

### Naming

**Do:**
- Use descriptive names: `exterior-north-view.jpg`
- Number gallery images: `01-`, `02-`, `03-`
- Use hyphens between words

**Don't:**
- Leave default camera names: `IMG_1234.jpg`
- Use spaces: `my image.jpg`
- Use special characters: `photo#1.jpg`

### Organization

**Do:**
- Keep all project images in the project folder
- Name the main thumbnail `header.jpg`
- Delete unused/old images

**Don't:**
- Scatter images across multiple folders
- Keep multiple versions (final, final2, final-final)
- Upload images to the wrong folder

### Quality

**Do:**
- Start with high-quality originals
- Use good lighting and composition
- Crop to focus on the important parts

**Don't:**
- Upload tiny, low-resolution images
- Use heavily compressed/degraded images
- Upload images with watermarks (unless intended)

---

## Quick Reference

| Task | How To Do It |
|------|-------------|
| Add thumbnail for project | Name it `header.jpg`, put in project folder |
| Add gallery images | Name them `01-name.jpg`, `02-name.jpg`, etc. |
| Add thumbnail for news | Name it `thumb.jpg`, put in news folder |
| Change thumbnail | Rename/replace `header.jpg` or `thumb.jpg` |
| Remove image from gallery | Delete the file or rename to start with `header` or `thumb` |
| Reorder gallery | Rename files to change alphabetical order |

---

## Example: Complete Project Folder

```
entries/projects/casa-marianella/
├── casa-marianella.md
├── header.jpg                   ← Index thumbnail (1920x1080, 800KB)
├── 01-site-view.jpg             ← Gallery (2400x1600, 1.2MB)
├── 02-entrance.jpg              ← Gallery (2400x1600, 900KB)
├── 03-common-area.jpg           ← Gallery (2400x1600, 1.1MB)
├── 04-bedroom.jpg               ← Gallery (2400x1600, 850KB)
└── 05-exterior-detail.jpg       ← Gallery (2400x1600, 1.0MB)
```

**Result:**
- `header.jpg` appears in the comprehensive index
- 5 gallery images appear on the project detail page in order
- All images are automatically optimized for web

---

## Next Steps

- **[Adding a Project](adding-a-project.md)** - Learn how to add content
- **[Frontmatter Reference](frontmatter-reference.md)** - All available fields
- **[Common Issues](../06-troubleshooting/common-issues.md)** - Fix problems

---

## Questions?

See [Image Problems](../06-troubleshooting/image-problems.md) for specific image issues.
