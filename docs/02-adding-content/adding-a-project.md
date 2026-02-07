# How to Add a Project

Step-by-step guide for adding a design project to the site.

---

## What You'll Create

When you add a project, you'll create:
- A folder for your project
- A text file (`.md`) with project details and metadata
- Images for the project thumbnail and gallery

---

## Step-by-Step Instructions

### Step 1: Navigate to the Projects Folder

Open the `entries/projects/` folder in your text editor or file browser.

This is where **ALL** projects live.

---

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

### Step 7: Commit and Publish

Save your changes and publish them to the live site using git.

See [Making Commits](../05-tools-and-workflow/making-commits.md) for step-by-step instructions.

**Quick version:**
```bash
git add .
git commit -m "Add Casa Marianella project"
git push
```

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
