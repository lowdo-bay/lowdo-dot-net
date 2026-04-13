# LowDO - Low Design Office

> "Realizing more with less"

An architecture and design studio portfolio website based in Austin, Texas.

## Documentation

- **[User Documentation](docs/README.md)** — For content editors and non-technical users
  - How to add/edit projects, news, awards, and other content
  - How to customize site colors and settings
  - How to use VS Code, git, and publish changes
  - Troubleshooting guides and FAQs
- **Technical Documentation** (below) — For developers and advanced users

---

## Workflow

- Always push, commit, create a PR, and update a local dev server after making any edits.

1. **Create a feature branch** — Never commit directly to main. Use `feature/description` or `fix/description` naming.

2. **Start the dev server** — After switching to your branch, run `npm run serve` and keep it running while you work.

3. **Make changes** — Edit files as needed. The dev server auto-reloads.

4. **Commit and push** — Stage changes with `git add`, commit with a clear message, and push to GitHub.

5. **Open a pull request** — Create a PR targeting main with a descriptive title and description of changes.

6. **Merge and clean up** — After approval/review, merge to main (which auto-deploys).


## Design Goals

### Philosophy
- **Minimalism**: The site should reflect the studio's design philosophy—clean, purposeful, and uncluttered
- **Performance**: Fast loading times are non-negotiable; every kilobyte matters
- **Accessibility**: The site must be usable by everyone, regardless of ability or device
-**Usability**: The site must be easily edited. The workflow to update the website should involve the user dropping in text and images into a folder and letting the code automatically generate a page.

### Visual Principles
- Technical but accessible visual language that recalls a spreadsheet. Lines are used to separate sections and objects. Think of a visible layout grid; making what is usually invisible visible.
- Generous whitespace to let projects breathe
- Typography that is readable and elegant
- Subtle transitions and interactions
- Consistent visual rhythm across pages

### Technical Principles
- Static-first architecture (no unnecessary JavaScript)
- Progressive enhancement over graceful degradation
- Semantic HTML structure
- Mobile-first responsive design

---

## Current Features

### Core
- [x] Static site generation with Eleventy
- [x] Responsive image processing (JPEG, WebP, AVIF)
- [x] Project pages generated from Markdown
- [x] Projects listing page

### Theming
- [x] Light/dark mode toggle with system preference detection
- [x] CSS custom properties for easy theming
- [x] Google Fonts integration with caching
- [x] Configurable colors via `settings.yaml`
- [x] Spreadsheet-style grid lines (dashed vertical, solid/dashed horizontal)
- [x] Project header with two-column layout (image left, metadata right)

### Performance
- [x] HTML/CSS/JS minification in production
- [x] Inline critical CSS
- [x] Lazy loading for images
- [x] Build caching for faster deploys
- [x] Next-gen image formats (WebP, AVIF)

### Infrastructure
- [x] Netlify hosting and deployment
- [x] Automatic CSP headers
- [x] Custom 404 page

---

## Project Structure Notes

```
_data/settings.yaml    # Site-wide configuration (edit this for theme changes)
entries/               # All content entries
  projects/            # Project entries — get individual pages at /project/{slug}/
  other/               # All non-project entries (news, awards, features, etc.)
_includes/components/  # Reusable template components
admin/                 # Password-protected admin page (/admin/)
netlify/functions/     # Serverless functions (admin auth + GitHub commit API)
scripts/               # One-time utility scripts (e.g. migration)
```

### Entry Type System

Entry type is stored in the `type:` frontmatter field of each `.md` file. The folder determines only whether an entry gets a detail page:
- `entries/projects/` — `type: project`, gets `/project/{slug}/` page + image gallery
- `entries/other/` — any other type (news, award, feature, lecture, exhibition, staff), index only

Changing between non-project types is a frontmatter-only operation. Changing to/from project requires moving the file between folders.

---

## Adding Content to the Comprehensive Index

The Comprehensive Index at `/index/` displays all entry types in a filterable spreadsheet-style layout.

### Supported Entry Types
- **project** - Design and build projects (get individual detail pages)
- **news** - Announcements and news items
- **award** - Awards and recognitions
- **feature** - Publications and media features
- **lecture** - Talks and presentations
- **exhibition** - Gallery shows and exhibitions
- **staff** - Team updates (new hires, departures, etc.)

### Adding a New Entry

**Via admin panel (recommended):** Go to `/admin/`, click `+ New Entry`, fill in fields, save.

**Manually:**
1. Create a folder in `entries/projects/` (for projects) or `entries/other/` (for everything else)
2. Create a markdown file with the same name as the folder
3. Add `type:` and other frontmatter fields

### Frontmatter Reference

**Required fields (all entries):**
```yaml
---
draft: false
type: award          # Entry type — determines filter label and project-only fields
title: "Entry Title"
date: 2024-01-15
---
```

**Common optional fields:**
```yaml
subtitle: "Brief tagline shown below title"  # Displayed in Column 2
categories:                                   # Displayed in Column 3
  - HOUSING
  - SUSTAINABLE
position: 1  # Sort order (lower = first)
```

### Metadata by Entry Type

**Projects** (`entries/projects/`, `type: project`)
- Get individual detail pages at `/project/{slug}/`
- Display collaborators in Column 3 (below categories)

```yaml
---
draft: false
type: project
title: "Project Name"
subtitle: "Brief tagline"
date: 2024-01-15
year: 2024
categories:
  - HOUSING
  - SUSTAINABLE
collaborators:
  - name: "Partner Name"
    role: "Structural Engineer"
position: 1
---
```

**Updates** (`entries/other/`, any non-project `type:`)
- Index-only display (no individual pages)
- Can link to external URLs

```yaml
---
draft: false
type: award
title: "Update Title"
subtitle: "Brief tagline"
description: "Short description"
date: 2024-01-15
link: "https://external-url.com"
position: 2
---
```

**Staff** (`entries/other/`, `type: staff`)
- Appear in the staff table on the About page
- `active: true/false` controls whether the person appears on the About page
- Markdown body is used as the bio

```yaml
---
draft: false
type: staff
title: "Full Name"
subtitle: "Role / Title"
date: 2024-01-15    # Start date — displayed as year on About page
active: true        # true = shown on About page, false = hidden
---

Bio text here.
```

### Category and Type Management

Categories and types can be renamed in bulk from the admin panel: `/admin/` → **Manage Labels**. This renames the label across all entries in one operation without needing to edit files individually.

### Adding Images

Drop an image file in the entry folder for automatic thumbnail:
- `header.jpg` or `header.png` - Preferred naming
- `thumb.jpg` or `thumb.png` - Alternative naming

For **projects only**, additional images are auto-discovered for the gallery on the detail page.

### Example: Adding an Award Entry

```
entries/other/emerging-voices-award/
├── emerging-voices-award.md
└── thumb.jpg
```

```yaml
# emerging-voices-award.md
---
draft: false
type: award
title: "Emerging Voices Award"
subtitle: "Architectural League of New York"
date: 2021-12-31
categories:
  - AWARD
link: "https://archleague.org/..."
relatedProjects:
  - "000000_project-slug"
---

LowDO has been selected for the Architectural League's Emerging Voices program...
```

## Development Commands

```bash
npm run serve          # Start development server
npm run build          # Production build
netlify dev            # Full Netlify dev environment
```

## Links

- **Live Site**: https://lowdo.netlify.app
