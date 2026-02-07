# Folder Structure

A visual guide to where everything lives in the LowDO repository.

---

## The Complete Structure

```
lowdo-dot-net/
├── entries/           ← YOU EDIT HERE (all content)
│   ├── projects/      ← Design projects (get own pages)
│   ├── news/          ← News items (index only)
│   ├── awards/        ← Awards and honors (index only)
│   ├── features/      ← Press and publications (index only)
│   ├── lectures/      ← Talks and presentations (index only)
│   ├── exhibitions/   ← Gallery shows (index only)
│   └── staff/         ← Team updates (index only)
├── _data/
│   └── settings.yaml  ← YOU EDIT HERE (site customization)
├── docs/              ← YOU ARE HERE (this documentation)
├── _includes/         ← DON'T EDIT (HTML templates)
├── assets/            ← DON'T EDIT (site resources)
├── _site/             ← DON'T EDIT (auto-generated HTML)
├── CLAUDE.md          ← Technical documentation
├── package.json       ← DON'T EDIT (dependencies)
├── .eleventy.js       ← DON'T EDIT (build config)
└── netlify.toml       ← DON'T EDIT (hosting config)
```

---

## Safe to Edit vs. Don't Touch

### ✅ Safe to Edit

These folders/files are designed for content creators:

| Path | What It Is | When to Edit |
|------|-----------|--------------|
| `entries/` | All content folders | Adding/editing projects, news, awards, etc. |
| `_data/settings.yaml` | Site configuration | Changing colors, site title, contact info |
| `docs/` | This documentation | Adding/updating guides |

### ⚠️ Advanced (Ask for Help)

These require coding knowledge:

| Path | What It Is | Caution |
|------|-----------|---------|
| `_includes/` | HTML templates | Changes affect site-wide layout |
| `assets/` | CSS, JavaScript, fonts | Changes affect site-wide styling |
| `.eleventy.js` | Build configuration | Changes affect how site is built |

### ❌ Never Touch

These are auto-generated:

| Path | What It Is | Why Not to Touch |
|------|-----------|------------------|
| `_site/` | Generated HTML | Gets deleted and rebuilt on every build |
| `node_modules/` | Dependencies | Auto-installed from package.json |

---

## The `entries/` Folder (Where Content Lives)

This is where you'll spend most of your time:

```
entries/
├── projects/                        ← Design projects
│   ├── casa-marianella/
│   │   ├── casa-marianella.md       ← Content file
│   │   ├── header.jpg               ← Thumbnail image
│   │   ├── 01-exterior.jpg          ← Gallery image
│   │   └── 02-interior.jpg          ← Gallery image
│   └── wolf-creek-ranch/
│       ├── wolf-creek-ranch.md
│       ├── header.jpg
│       └── 01-wide-view.jpg
├── news/                            ← News items
│   └── emerging-voices-award/
│       ├── emerging-voices-award.md
│       └── thumb.jpg
├── awards/                          ← Awards and recognitions
├── features/                        ← Press coverage
├── lectures/                        ← Talks and presentations
├── exhibitions/                     ← Gallery shows
└── staff/                           ← Team updates
```

### Key Pattern

Every entry follows this structure:

```
entries/{type}/{entry-name}/
├── {entry-name}.md     ← Markdown file (same name as folder)
└── image.jpg           ← Optional image(s)
```

**Important:** The folder name and the `.md` filename must match!

✅ Good:
```
casa-marianella/
└── casa-marianella.md
```

❌ Bad:
```
casa-marianella/
└── project.md           (wrong name)
```

---

## Entry Type Folders

### `entries/projects/` (Get Own Pages)

Projects get individual detail pages at `/project/{name}/`:

```
projects/casa-marianella/
├── casa-marianella.md       ← Required: content and metadata
├── header.jpg               ← Recommended: main thumbnail
├── 01-exterior-view.jpg     ← Optional: gallery image
├── 02-interior-space.jpg    ← Optional: gallery image
└── 03-detail-shot.jpg       ← Optional: gallery image
```

All images in the folder (except `header.*`/`thumb.*`) are auto-added to the gallery.

### `entries/news/` (Index Only)

News items appear in the comprehensive index but don't get their own pages:

```
news/studio-expansion/
├── studio-expansion.md      ← Required: content and metadata
└── thumb.jpg                ← Optional: thumbnail for index
```

### Other Types (Index Only)

Same structure as news:

- `awards/` - Awards and recognitions
- `features/` - Press coverage and publications
- `lectures/` - Talks and presentations
- `exhibitions/` - Gallery shows
- `staff/` - Team updates

---

## The `_data/` Folder (Site Settings)

Contains configuration files:

```
_data/
└── settings.yaml    ← Site-wide settings
```

### What's in settings.yaml?

```yaml
# Site metadata
title: "LowDO"
description: "Low Design Office - Architecture and Design Studio"
email: "lowdo@lowdo.net"

# Theme colors
colors:
  background: "#ffffff"
  text: "#000000"
  accent: "#0000ff"

# Typography
fonts:
  body: "Helvetica, Arial, sans-serif"
  heading: "Helvetica, Arial, sans-serif"

# And more...
```

See [Settings Reference](../04-customizing-the-site/settings-reference.md) for details.

---

## The `docs/` Folder (This Documentation)

You're here! This folder contains all user-friendly guides:

```
docs/
├── README.md                      ← Table of contents
├── 00-start-here.md              ← Quick orientation
├── 01-understanding-the-site/    ← How it works
├── 02-adding-content/            ← Content creation guides
├── 03-editing-content/           ← Editing guides
├── 04-customizing-the-site/      ← Customization guides
├── 05-tools-and-workflow/        ← Git, VS Code, etc.
├── 06-troubleshooting/           ← Common problems
└── 07-reference/                 ← Quick references
```

---

## The `_includes/` Folder (Templates)

⚠️ **Advanced users only**

Contains HTML templates and components:

```
_includes/
├── layouts/              ← Page layouts (base, project, etc.)
├── components/           ← Reusable components (header, footer, etc.)
└── assets/
    ├── css/             ← Stylesheets
    └── js/              ← JavaScript
```

**When to edit:**
- Simple CSS tweaks (colors, spacing) - See [Editing CSS Basics](../04-customizing-the-site/editing-css-basics.md)
- Complex changes - Ask for help

---

## The `_site/` Folder (Auto-Generated)

❌ **Never edit**

This folder contains the generated HTML that gets published. It's completely auto-generated and gets deleted/rebuilt on every build.

```
_site/
├── index.html              ← Generated homepage
├── all/
│   └── index.html          ← Generated comprehensive index
├── project/
│   ├── casa-marianella/
│   │   └── index.html      ← Generated project page
│   └── wolf-creek-ranch/
│       └── index.html
└── assets/                 ← Optimized images, CSS, JS
```

**Why you see it:** Git ignores this folder, but it exists locally after running `npm run build` or `npm run serve`.

---

## Example: Where Does a Project Live?

Let's trace a real example: the "Casa Marianella" project.

### Source Files (What You Create)

```
entries/projects/casa-marianella/
├── casa-marianella.md       ← You create this
│   ---
│   title: "Casa Marianella"
│   date: 2023-06-15
│   categories:
│     - HOUSING
│     - COMMUNITY
│   ---
│   Project description here...
│
├── header.jpg               ← You add this
├── 01-exterior.jpg          ← You add this
└── 02-interior.jpg          ← You add this
```

### Generated Pages (What the System Creates)

```
_site/project/casa-marianella/
└── index.html               ← Auto-generated detail page

_site/all/
└── index.html               ← Auto-generated index (includes this project)
```

### Live URLs (What Visitors See)

- **Project page:** https://lowdo.netlify.app/project/casa-marianella/
- **Index listing:** https://lowdo.netlify.app/all/

---

## Where to Put Things: Quick Reference

| What You're Adding | Where It Goes | Example |
|-------------------|---------------|---------|
| Design project | `entries/projects/{name}/` | `entries/projects/casa-marianella/` |
| News item | `entries/news/{name}/` | `entries/news/studio-expansion/` |
| Award | `entries/awards/{name}/` | `entries/awards/emerging-voices/` |
| Press feature | `entries/features/{name}/` | `entries/features/austin-chronicle/` |
| Lecture | `entries/lectures/{name}/` | `entries/lectures/ut-talk/` |
| Exhibition | `entries/exhibitions/{name}/` | `entries/exhibitions/gallery-show/` |
| Staff update | `entries/staff/{name}/` | `entries/staff/new-hire-ann/` |
| Site colors | `_data/settings.yaml` | (edit the `colors:` section) |
| Site title/info | `_data/settings.yaml` | (edit the `title:`, `email:` fields) |

---

## File Naming Rules

**Folders:**
- Use lowercase letters
- Use hyphens instead of spaces
- Be descriptive but concise

✅ Good: `casa-marianella`, `emerging-voices-award`, `austin-monthly-feature`
❌ Bad: `Casa Marianella`, `project1`, `new_award`

**Markdown files:**
- Must match the folder name
- Add `.md` extension

✅ Good: `casa-marianella/casa-marianella.md`
❌ Bad: `casa-marianella/project.md`

**Images:**
- Use descriptive names
- Use lowercase and hyphens
- Special names: `header.jpg`, `thumb.jpg` (used as thumbnails)

✅ Good: `header.jpg`, `01-exterior-view.jpg`, `detail-closeup.jpg`
❌ Bad: `IMG_1234.jpg`, `photo (1).jpg`, `FINAL.jpg`

See [File Naming Conventions](../07-reference/file-naming-conventions.md) for complete rules.

---

## Hidden Files (Dot Files)

Some files start with a dot (`.`). These are usually configuration:

```
.eleventy.js       ← Build configuration
.gitignore         ← Files git should ignore
.eleventyignore    ← Files Eleventy should ignore
```

You generally don't need to edit these unless you're doing advanced setup.

---

## Next Steps

Now that you understand where files live:

1. **[How to Add a Project](../02-adding-content/adding-a-project.md)** - Create your first entry
2. **[Comprehensive Index Guide](comprehensive-index-guide.md)** - Understand the index page
3. **[Settings Reference](../04-customizing-the-site/settings-reference.md)** - Customize the site

---

## Questions?

- **"Where do I add a new project?"** - `entries/projects/{project-name}/`
- **"Where do images go?"** - In the same folder as the `.md` file
- **"Can I create subfolders in entries?"** - No, keep it flat: `entries/projects/{name}/`
- **"What if I put files in the wrong place?"** - Move them to the right folder and rebuild

See [FAQ](../06-troubleshooting/faq.md) for more questions.
