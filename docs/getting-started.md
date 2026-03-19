# Getting Started

Welcome to the LowDO website! This guide will help you understand how the site works and get oriented to editing content.

---

## What Can You Do Without Knowing How to Code?

You can do everything:

✅ **Add new content** — Design projects, news, awards, press features, lectures, exhibitions, staff updates
✅ **Edit existing content** — Update descriptions, dates, categories, metadata, hide content
✅ **Customize the site** — Change colors, themes, site title, contact information
✅ **Publish changes** — Save and deploy to live site (no manual builds)

❌ **What you CAN'T do easily** — Change layout/structure, add new features, modify code (ask an AI assistant for these)

---

## What You'll Need

### Required
- Web browser (Chrome, Firefox, Safari, etc.)
- GitHub account with access to lowdo-dot-net repository
- This documentation

### Optional (But Helpful)
- VS Code text editor for local editing
- Git command-line tools

**Most people can edit everything using just their web browser!**

---

## How the Site Works

### The Big Picture

LowDO is a **static site**, meaning:

- **Content lives in text files** (not a database like WordPress)
- **Pages are pre-built** — When you add content, the system automatically generates HTML pages
- **Everything is automatic** — You add folders/files, the system handles discovery, image optimization, and index updates
- **Fast & secure** — Static sites load instantly and are harder to hack

### The Workflow

```
You create/edit files on GitHub
        ↓
Netlify detects changes
        ↓
Eleventy build system runs (3-5 min)
        ↓
Site rebuilds with your content
        ↓
Changes go live at lowdo.netlify.app
```

### Content Types

**Projects** — Get their own detail pages with galleries
- Folder: `entries/projects/{project-name}/`
- URL: `/project/{project-name}/`

**Updates** — Appear in the comprehensive index at `/all/`, no individual pages
- News, awards, features, lectures, exhibitions, staff
- Folders: `entries/{type}/{entry-name}/`

### The Automatic System

✅ **Automatic:**
- File discovery — add a file and it appears on the site
- Image discovery — drop images in a folder and they're added to the gallery
- Index updates — comprehensive index automatically shows new entries
- Filter generation — categories automatically become filter options
- Image optimization — images are automatically resized and compressed

### Where Changes Happen

**Files you edit:**
- `entries/` — All content (projects, news, awards, etc.)
- `_data/settings.yaml` — Site colors, title, email

**Don't touch:**
- `_includes/` — HTML templates and code
- `_site/` — Auto-generated output

---

## Next Steps

1. **[Adding Content](adding-content/adding-a-project.md)** — How to add your first project
2. **[GitHub Web Editor](tools/github-web-editor.md)** — How to edit using your web browser
3. **[Frontmatter Reference](adding-content/frontmatter.md)** — Complete guide to entry fields
4. **[Customizing the Site](customizing.md)** — How to change colors and info

---

## Questions?

- Check [Troubleshooting](troubleshooting.md)
- Ask an AI assistant (Claude, ChatGPT, etc.)
- Email lowdo@lowdo.net
