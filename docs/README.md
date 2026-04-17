# LowDO Website Documentation

Welcome to the LowDO website. This guide will help you get oriented and start editing content.

---

## What Can You Do Without Knowing How to Code?

✅ **Add new content** — Design projects, news, awards, press features, lectures, exhibitions, staff updates
✅ **Edit existing content** — Update descriptions, dates, categories, metadata, hide content
✅ **Customize the site** — Change colors, themes, site title, contact information
✅ **Publish changes** — Save and deploy to the live site (no manual builds)

❌ **What you CAN'T do easily** — Change layout/structure, add new features, modify code (ask an AI assistant for these)

---

## What You'll Need

- Web browser (Chrome, Firefox, Safari, etc.)
- GitHub account with access to the lowdo-dot-net repository
- This documentation

**Most people can edit everything using just their web browser!**

---

## How the Site Works

LowDO is a **static site**, meaning content lives in text files (not a database like WordPress). When you add or edit files, the system automatically discovers them, generates pages, and updates the index.

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

**Projects** — Get their own detail pages with image galleries
- Folder: `entries/projects/{project-name}/`
- URL: `/project/{project-name}/`

**Updates** — Appear in the index at `/all/`, no individual pages
- News, awards, features, lectures, exhibitions, staff
- Folder: `entries/other/{entry-name}/`

### What's Automatic

- File discovery — add a file and it appears on the site
- Image discovery — drop images in a folder and they're added to the gallery
- Index updates — comprehensive index automatically shows new entries
- Image optimization — images are automatically resized and compressed

### Files You Edit

- `entries/` — All content (projects, news, awards, etc.)
- `_data/settings.yaml` — Site colors, title, contact info

**Don't touch:** `_includes/` (templates and code) or `_site/` (auto-generated output).

---

## Adding Content

- [How to Add a Project](02-adding-content/adding-a-project.md) — Complete guide with file naming conventions
- [How to Add News, Awards, & More](02-adding-content/adding-news-awards.md) — Festivals, lectures, exhibitions, and staff updates
- [Image Guide](02-adding-content/image-guide.md) — Best practices for image naming and uploading
- [Frontmatter Reference](02-adding-content/frontmatter-reference.md) — Complete field guide

## Editing & Customizing

- [Editing Existing Entries](03-editing-content/editing-existing-entries.md) — Update, hide, or reorganize content
- [Customizing the Site](04-customizing-the-site/changing-colors.md) — Change colors, title, contact info
- [GitHub Web Editor](05-tools-and-workflow/github-web-editor.md) — Edit files in your browser (no installation)

## Tools & Workflow

- [Git for Beginners](05-tools-and-workflow/git-for-beginners.md) — Version control basics
- [Making Commits](05-tools-and-workflow/making-commits.md) — How to save and publish changes
- [Local Development](05-tools-and-workflow/code-editor-setup.md) — VS Code setup and preview
- [Using AI Assistants](05-tools-and-workflow/using-ai-assistants.md) — How to get help from Claude, ChatGPT, etc.

## Admin Panel

- [Using the Admin Panel](08-admin/using-the-admin.md) — Manage entries, edit fields, rename categories/types, and publish changes

## Help & Reference

- [Troubleshooting](06-troubleshooting/common-issues.md) — Fix common issues
- [FAQ](06-troubleshooting/faq.md) — Frequently asked questions
- [Glossary](07-reference/glossary.md) — Terminology
- [Entry Types](07-reference/entry-types-comparison.md) — Projects vs. news vs. awards
- [Categories](07-reference/category-guidelines.md) — How to use categories
