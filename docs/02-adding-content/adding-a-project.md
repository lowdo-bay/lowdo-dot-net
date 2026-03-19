# How to Add a Project

Step-by-step guide for adding a design project to the site.

---

## Editing Options

You can add a project in two ways:

### Option 1: GitHub Web Editor (No Installation)

Use GitHub.com to create files directly in your browser:
- ✅ No software to install
- ✅ Works on any device
- ✅ Can use AI assistants for help
- ✅ See [GitHub Web Editor Guide](../05-tools-and-workflow/github-web-editor.md)

**This guide shows the web editor workflow first, then local editing.**

### Option 2: Local Development (Advanced)

Install VS Code and edit files on your computer:
- ⚡ Faster feedback
- ⚡ Local preview
- ⚡ Better for complex changes
- ⚡ See [Code Editor Setup](../05-tools-and-workflow/code-editor-setup.md)

---

## What You'll Create

When you add a project, you'll create:
- A folder for your project
- A text file (`.md`) with project details and metadata
- Images for the project thumbnail and gallery

---

## Web Editor Workflow

### Step 1: Go to GitHub.com

1. Navigate to https://github.com/lowdo-bay/lowdo-dot-net
2. Navigate to `entries/projects/` folder
3. You should see other project folders listed

### Step 2: Create the Project File

1. Click **"Add file"** → **"Create new file"**
2. In the name field, type the full path:
   ```
   your-project-name/your-project-name.md
   ```
3. GitHub automatically creates the folder structure

**Naming Rules:**
- Use lowercase letters only
- Use hyphens (`-`) instead of spaces
- Be descriptive but concise
- This name will appear in the URL

✅ **Good names:**
- `casa-marianella/casa-marianella.md`
- `wolf-creek-ranch/wolf-creek-ranch.md`
- `community-housing-center/community-housing-center.md`

❌ **Bad names:**
- `Casa Marianella/Casa Marianella.md` (has capitals and spaces)
- `project1/project1.md` (not descriptive)
- `new_project/new_project.md` (uses underscores)

### Step 3: Add Project Information

Copy this template and fill in your details:

```yaml
---
draft: false
title: "Casa Marianella"
subtitle: "Community Housing and Resource Center"
date: 2023-06-15
year: 2023
categories:
  - HOUSING
  - COMMUNITY
  - SUSTAINABLE
collaborators:
  - name: "Structural Innovations"
    role: "Structural Engineer"
  - name: "GreenBuild Contractors"
    role: "General Contractor"
description: "A community resource center providing housing and support services"
---

Write your project description here. This text appears on the project detail page.

You can write multiple paragraphs. Use simple formatting like **bold** and *italic*.

## Project Details

You can add sections with headings using ##. Describe the project goals, process, and outcomes in a way that's accessible to visitors.

## Design Approach

Add as many sections as you need to tell the project story.
```

**The section between `---` lines is called "frontmatter"** - it contains metadata about your project.

See [Frontmatter Reference](frontmatter-reference.md) for details on all available fields.

**Awards & Recognition:** Projects automatically display awards, features, press coverage, and other recognitions that are linked to them. To link an award or news item to this project, see [Adding News & Awards](adding-news-awards.md) and use the `relatedProject` field.

### Image File Naming Conventions

When you add images to your project, use these naming conventions:

| Prefix | Example | Purpose |
|--------|---------|---------|
| `header.jpg` | `header.jpg` | Main thumbnail shown in index + top of project page |
| `00_`, `01_`, etc. | `00_Exterior view.jpg` | Gallery photos (numbered for sort order) |
| `drawing-` | `drawing-plan_1.jpg` | Floor plans and architectural drawings |
| `toolkit-` | `toolkit-framing-plan.dwg` | Reference files (CAD, PDF, DWG, etc.) |

**Numbering tip:** Use zero-padded numbers to control order:
- `00_name.jpg` ← Appears first
- `01_name.jpg` ← Appears second
- `02_name.jpg` ← Appears third

### Step 4: Commit the File

1. Scroll down to "Commit changes"
2. Write a commit message: `Add [Project Name] project`
3. Select **"Create a new branch for this commit and start a pull request"**
4. Click "Propose changes"
5. Click "Create pull request"

### Step 5: Upload Images

1. In your pull request, click on "Files changed" tab, then "Review changes" → "View"
2. Navigate to your project folder: `entries/projects/your-project-name/`
3. Click **"Add file"** → **"Upload files"**
4. Drag and drop your images (or click "choose your files")

**Before uploading, rename your images:**
- Main thumbnail: `header.jpg` or `thumb.jpg`
- Gallery images: `01-exterior-view.jpg`, `02-interior-space.jpg`, etc.

5. Make sure to **commit to the same branch** you created earlier
6. Write commit message: `Add images for [Project Name]`
7. Click "Commit changes"

### Step 6: Wait for Preview

1. Go back to your pull request
2. Wait 3-5 minutes for Netlify to build a preview
3. Look for "netlify/deploy-preview" check
4. Click "Details" to see your preview site

### Step 7: Test and Merge

1. Navigate to your project on the preview site:
   - Go to `/all/` to see it in the index
   - Click it to see the detail page
2. Check that everything looks correct
3. If you need to fix something, make more commits to the same branch
4. When ready, click **"Merge pull request"**
5. Click **"Confirm merge"**

**Your project goes live in 3-5 minutes!**

---

## Local Development Workflow

### Step 1: Navigate to the Projects Folder

Open the `entries/projects/` folder in your text editor or file browser.

This is where **ALL** projects live.

---

## Local Development Workflow (Continued)

### Step 2: Create a New Folder for Your Project

Create a new folder with a name that describes your project.

**Naming Rules:**
- Use lowercase letters only
- Use hyphens (`-`) instead of spaces
- Be descriptive but concise
- This name will appear in the URL

✅ **Good names:**
- `casa-marianella`
- `wolf-creek-ranch`
- `community-housing-center`

❌ **Bad names:**
- `Casa Marianella` (has capitals and spaces)
- `project1` (not descriptive)
- `new_project` (uses underscores instead of hyphens)

**Example:**
```
entries/projects/casa-marianella/
```

The URL will be: `/project/casa-marianella/`

---

### Step 3: Create a Markdown File

Inside your new folder, create a text file with the **same name** as the folder, plus `.md` extension.

**Important:** The folder name and file name must match!

✅ **Correct:**
```
casa-marianella/
└── casa-marianella.md
```

❌ **Wrong:**
```
casa-marianella/
└── project.md        (doesn't match folder name)
```

---

### Step 4: Add Project Information

Open the `.md` file and add your project information.

Copy this template and fill in your details:

```yaml
---
draft: false
title: "Casa Marianella"
subtitle: "Community Housing and Resource Center"
date: 2023-06-15
year: 2023
categories:
  - HOUSING
  - COMMUNITY
  - SUSTAINABLE
collaborators:
  - name: "Structural Innovations"
    role: "Structural Engineer"
  - name: "GreenBuild Contractors"
    role: "General Contractor"
description: "A community resource center providing housing and support services"
---

Write your project description here. This text appears on the project detail page.

You can write multiple paragraphs. Use simple formatting like **bold** and *italic*.

## Project Details

You can add sections with headings using ##. Describe the project goals, process, and outcomes in a way that's accessible to visitors.

## Design Approach

Add as many sections as you need to tell the project story.
```

**The section between `---` lines is called "frontmatter"** - it contains metadata about your project.

See [Frontmatter Reference](frontmatter-reference.md) for details on all available fields.

**Awards & Recognition:** Projects automatically display awards, features, press coverage, and other recognitions that are linked to them. To link an award or news item to this project, see [Adding News & Awards](adding-news-awards.md) and use the `relatedProject` field.

---

### Step 5: Add Images

Drop image files (`.jpg` or `.png`) into your project folder.

**Thumbnail Image:**
- Name one image `header.jpg` or `thumb.jpg`
- This becomes the main thumbnail in the comprehensive index

**Gallery Images:**
- All other images in the folder are automatically added to the project gallery
- Name them descriptively: `01-exterior-view.jpg`, `02-interior-space.jpg`, etc.
- The system displays them in alphabetical order

**Example folder with images:**
```
entries/projects/casa-marianella/
├── casa-marianella.md
├── header.jpg              ← Thumbnail for index
├── 01-exterior-view.jpg    ← Gallery image 1
├── 02-interior-space.jpg   ← Gallery image 2
└── 03-detail-shot.jpg      ← Gallery image 3
```

See [Image Guide](image-guide.md) for best practices.

---

### Step 6: Save Everything

- Save the `.md` file
- Make sure all images are in the project folder
- Your folder structure should look complete

---

### Step 7: Commit and Publish (Local)

Save your changes and publish them to the live site using git.

See [Making Commits](../05-tools-and-workflow/making-commits.md) for detailed instructions.

**Quick version:**
```bash
git add .
git commit -m "Add Casa Marianella project"
git push
```

Then create a pull request on GitHub.com, wait for preview, test, and merge.

---

## What Happens Next?

Once you push your changes to GitHub:

1. **Netlify detects the change** (takes a few seconds)
2. **The site rebuilds** (takes 3-5 minutes)
3. **Your project goes live** at `/project/{your-project-name}/`
4. **The project appears in the comprehensive index** at `/all/`
5. **Visitors can filter by your categories**

---

## Required Fields

These fields **must** be in your frontmatter:

| Field | What It Does | Example |
|-------|-------------|---------|
| `draft: false` | Controls visibility (`false` = published) | `draft: false` |
| `title: "..."` | Project name (shows everywhere) | `title: "Casa Marianella"` |
| `date: YYYY-MM-DD` | Project completion date | `date: 2023-06-15` |

---

## Optional Fields

Add these to enhance your project:

| Field | What It Does | Example |
|-------|-------------|---------|
| `subtitle: "..."` | Tagline shown below title | `subtitle: "Community Housing Center"` |
| `year: YYYY` | Show year instead of full date | `year: 2023` |
| `categories: [...]` | Topic tags (all caps) | `categories:`<br>`  - HOUSING`<br>`  - DESIGN` |
| `collaborators: [...]` | Project partners | See template above |
| `description: "..."` | Short summary | `description: "A housing center..."` |
| `position: number` | Sort order (lower = first) | `position: 1` |

---

## Tips

**Folder naming:**
- Keep it short and descriptive
- The folder name becomes the URL slug
- You can't easily change it later without breaking links

**Title vs. Subtitle:**
- **Title** = Main project name
- **Subtitle** = Brief tagline or context

**Categories:**
- Use existing categories when possible (keeps the filters organized)
- See [Category Guidelines](../07-reference/category-guidelines.md)
- Format: ALL CAPS, no punctuation

**Images:**
- One `header.jpg` or `thumb.jpg` is recommended
- Additional images are optional but make the project page richer
- See [Image Guide](image-guide.md) for sizes and formats

**Writing content:**
- Write in markdown (simple text formatting)
- Use `##` for section headings
- Use `**bold**` and `*italic*` for emphasis
- Keep paragraphs short for readability

---

## Troubleshooting

**"My project doesn't appear in the index"**
- Check `draft: false` (not `draft: true`)
- Check file naming (folder and `.md` file must match)
- Check date format (YYYY-MM-DD)
- Wait 3-5 minutes for the build to complete

**"The wrong image shows up"**
- Make sure you have `header.jpg` or `thumb.jpg`
- Check for multiple files with those names (delete duplicates)

**"My categories don't appear in filters"**
- Categories must be in the frontmatter `categories:` list
- Format: ALL CAPS
- Rebuild the site to update filters

See [Common Issues](../06-troubleshooting/common-issues.md) for more help.

---

## Next Steps

- **[Add News, Awards, etc.](adding-news-awards.md)** - Add non-project entries
- **[Image Guide](image-guide.md)** - Best practices for images
- **[Frontmatter Reference](frontmatter-reference.md)** - Complete field guide
- **[Making Commits](../05-tools-and-workflow/making-commits.md)** - Publish your changes

---

## Questions?

See the [FAQ](../06-troubleshooting/faq.md) or ask a team member for help.
