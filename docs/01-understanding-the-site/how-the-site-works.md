# How the Site Works

A high-level overview of how the LowDO website works, explained in plain language.

---

## The Big Picture

The LowDO website is a **static site**, which means:

- **Not a database-driven site** - Content lives in text files, not a database like WordPress or Squarespace
- **Pre-built pages** - When you add content, the system generates HTML pages ahead of time
- **Fast and secure** - Static sites load quickly and are harder to hack
- **Automatic updates** - When you save changes, the site rebuilds itself automatically

Think of it like this: instead of a system that builds pages on-the-fly when someone visits, our site builds all the pages once and serves them instantly.

---

## How Content is Stored

All content lives in **text files** with a `.md` extension (markdown files).

### What is Markdown?

Markdown is a simple way to write formatted text using plain text. For example:

```markdown
# This is a heading

This is a paragraph with **bold text** and *italic text*.

- This is a bullet list
- Second item
```

You don't need to know HTML or any programming—just write text with simple formatting symbols, and the system converts it to a webpage.

---

## The Build System: Eleventy

**Eleventy** is the "build system" that turns your markdown files into a website.

### What does it do?

1. **Discovers files** - Finds all your `.md` files in the `entries/` folder
2. **Reads metadata** - Extracts information like title, date, categories from the file
3. **Finds images** - Auto-discovers images in your entry folders
4. **Generates pages** - Creates HTML pages from your markdown
5. **Updates the index** - Adds your entry to the comprehensive index at `/all/`
6. **Optimizes everything** - Compresses images, minifies code for speed

**The key idea:** You don't configure any of this. You just add files, and Eleventy does the rest.

---

## Content Types

The site has two main types of content:

### 1. Projects (Get Their Own Pages)

Projects are the main design work. Each project gets:
- A dedicated detail page at `/project/{project-name}/`
- An image gallery with multiple photos
- Space for detailed descriptions and collaborator information
- An entry in the comprehensive index

**Where they live:** `entries/projects/{project-name}/`

### 2. Updates (Index Only)

Everything else appears in the comprehensive index but doesn't get its own page:
- **News** - Studio announcements
- **Awards** - Honors and recognitions
- **Features** - Press coverage and publications
- **Lectures** - Talks and presentations
- **Exhibitions** - Gallery shows
- **Staff** - Team updates

**Where they live:** `entries/{type}/{entry-name}/`

---

## The Automatic System

One of the best features: **everything is automatic**. You don't need to manually update lists or tell the system about new files.

### What Happens Automatically

✅ **File discovery** - Add a file to `entries/projects/` and it automatically appears on the site
✅ **Image discovery** - Drop images in a folder and they're automatically added to the gallery
✅ **Index updates** - The comprehensive index at `/all/` automatically shows new entries
✅ **Filter generation** - Categories you add automatically become filter options
✅ **Image optimization** - Images are automatically resized and compressed

### What You Do Manually

❌ Create folders and files
❌ Write content and add images
❌ Set metadata (title, date, categories)
❌ Save and publish changes with git

---

## Where Changes Happen

Here's the flow from editing to live website:

### 1. Edit Files on Your Computer

You work with files in the repository on your local machine using a text editor (like VS Code).

```
You → Edit files locally → Save to disk
```

### 2. Save Changes with Git

Git is a version control system that tracks all changes to files. Think of it like "Google Docs version history" but for code.

```
You → Git commit (save snapshot) → Git push (upload to GitHub)
```

See [Git for Beginners](../05-tools-and-workflow/git-for-beginners.md) for more details.

### 3. Push to GitHub

GitHub is a website that hosts your code. When you push changes, they're uploaded to the cloud.

```
Your computer → Push to GitHub → GitHub repository updated
```

### 4. Netlify Rebuilds the Site

Netlify is the hosting service that automatically:
- Detects changes on GitHub
- Runs the Eleventy build system
- Generates updated HTML pages
- Publishes the new site

**This takes 3-5 minutes.**

```
GitHub update → Netlify detects change → Rebuilds site → Publishes to live URL
```

### 5. Live Site Updates

The updated site appears at https://lowdo.netlify.app

```
Netlify → Live site updated → Visitors see your changes
```

---

## The Comprehensive Index

The comprehensive index at `/all/` is the heart of the site. It displays all content in a spreadsheet-style table.

### What It Shows

- All projects, news, awards, features, lectures, exhibitions, and staff updates
- Four columns: Image, Item (title), Details, Date
- Filterable by entry type (PROJECT, NEWS, etc.) and categories (HOUSING, SUSTAINABLE, etc.)

### How It Works

1. The build system collects all entries from `entries/` folders
2. It extracts metadata (title, date, categories, etc.) from each file
3. It generates the index page with all entries
4. It creates filter checkboxes from unique entry types and categories

See [Comprehensive Index Guide](comprehensive-index-guide.md) for a detailed explanation.

---

## File Organization

The repository is organized into folders:

**You edit these:**
- `entries/` - All your content (projects, news, awards, etc.)
- `_data/settings.yaml` - Site configuration (colors, title, etc.)
- `docs/` - This documentation

**Don't touch these:**
- `_includes/` - HTML templates and code
- `assets/` - Site resources
- `_site/` - Auto-generated output (gets deleted on each build)

See [Folder Structure](folder-structure.md) for a detailed visual guide.

---

## Key Concepts

### Static Site
Pre-built HTML pages served directly to visitors. Fast, secure, and simple.

### Build System (Eleventy)
Software that converts markdown files into HTML pages.

### Version Control (Git)
Tracks all changes to files, allowing you to save snapshots and undo mistakes.

### Hosting (Netlify)
Service that publishes your site to the internet and automatically rebuilds when you make changes.

### Frontmatter
Metadata at the top of markdown files (between `---` lines) that tells the system about your content.

---

## The Magic: Auto-Generation

The most important thing to understand: **you don't manually build anything**.

When you add a new project:
1. ❌ You don't manually add it to a list
2. ❌ You don't manually create an HTML page
3. ❌ You don't manually update the index
4. ❌ You don't manually optimize images

Instead:
1. ✅ You create a folder and a markdown file
2. ✅ You add images to the folder
3. ✅ You save and push your changes
4. ✅ The system does everything else

---

## What Happens When You Add Content

Let's trace a real example. You add a new project called "Casa Marianella":

### Step 1: You Create Files
```
entries/projects/casa-marianella/
├── casa-marianella.md    (with title, date, categories)
└── header.jpg            (main image)
```

### Step 2: You Commit and Push
```bash
git add .
git commit -m "Add Casa Marianella project"
git push
```

### Step 3: Build System Runs (Automatically)

Eleventy:
- Discovers `casa-marianella.md`
- Reads frontmatter (title, date, categories)
- Finds `header.jpg` for the thumbnail
- Generates `/project/casa-marianella/index.html`
- Adds entry to comprehensive index
- Optimizes images

### Step 4: Site Goes Live (Automatically)

Netlify:
- Detects GitHub update
- Runs the build
- Publishes new HTML to lowdo.netlify.app
- Your project appears on the site!

**Total time:** 3-5 minutes from push to live.

---

## Why This Approach?

### Advantages

✅ **Content-first** - Just write markdown, don't worry about code
✅ **Automatic** - System handles discovery, generation, optimization
✅ **Fast** - Pre-built pages load instantly
✅ **Secure** - No database to hack
✅ **Version controlled** - Full history of all changes
✅ **Collaborative** - Multiple people can work at once

### Trade-offs

❌ **Not instant** - Changes take 3-5 minutes to build and deploy
❌ **Requires git** - Must learn basic version control concepts
❌ **Text-based** - No visual editor like WordPress

---

## Next Steps

Now that you understand how the site works:

1. **[Folder Structure](folder-structure.md)** - Learn where files go
2. **[Adding a Project](../02-adding-content/adding-a-project.md)** - Try adding content
3. **[Git for Beginners](../05-tools-and-workflow/git-for-beginners.md)** - Understand version control

---

## Questions?

- **"Do I need to know how to code?"** - No! You just need to create folders, write markdown, and use git.
- **"What if I break something?"** - Git tracks all changes, so you can always undo.
- **"How long until my changes appear?"** - 3-5 minutes after pushing to GitHub.
- **"Can multiple people work at once?"** - Yes! Git handles merging changes from different people.

See [FAQ](../06-troubleshooting/faq.md) for more questions.
