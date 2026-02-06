# LowDO - Low Design Office

> "Realizing more with less"

An architecture and design studio portfolio website based in Austin, Texas.

## Workflow

- Always push, commit, create a PR, and update a local dev server after making any edits.

1. **Create a feature branch** — Never commit directly to main. Use `feature/description` or `fix/description` naming.

2. **Start the dev server** — After switching to your branch, run `npm start` and keep it running while you work.

3. **Make changes** — Edit files as needed. The dev server auto-reloads.

4. **Commit and push** — Stage changes with `git add`, commit with a clear message, and push to GitHub.

5. **Open a pull request** — Create a PR targeting main with a descriptive title and description of changes.

6. **Merge and clean up** — After approval/review, merge to main (which auto-deploys) and delete the branch.


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

## Wishlist / Future Features

### High Priority
- [x] Data filtering/categories (Comprehensive Index with checkbox filters)
- [ ] Image lightbox/gallery viewer

### Medium Priority
- [ ] Project search functionality
- [ ] Related projects suggestions
- [ ] Print stylesheet for project pages

### Low Priority / Nice to Have
- [x] Blog/news section (via Comprehensive Index entry types)
- [ ] Project timeline/archive view
- [ ] Multi-language support (i18n)
- [ ] Client testimonials section
- [ ] Team/people page

### Technical Improvements
- [ ] Implement service worker for offline support
- [ ] Add structured data (JSON-LD) for SEO
- [ ] Improve Lighthouse scores to 100 across all metrics
- [ ] Add visual regression testing
- [ ] Implement critical CSS extraction per-page

---

## Project Structure Notes

```
_data/settings.yaml    # Site-wide configuration (edit this for theme changes)
entries/               # All content entries (projects, news, awards, etc.)
  projects/            # Project entries with individual pages
  news/                # News entries
  awards/              # Award entries
  features/            # Feature/publication entries
  lectures/            # Lecture entries
  exhibitions/         # Exhibition entries
  staff/               # Staff update entries
_includes/components/  # Reusable template components
assets/uploads/        # Images uploaded via CMS
```

---

## Adding Content to the Comprehensive Index

The Comprehensive Index at `/index/` displays all entry types in a filterable spreadsheet-style layout.

### Supported Entry Types
- **projects** - Design and build projects (get individual detail pages)
- **news** - Announcements and news items
- **awards** - Awards and recognitions
- **features** - Publications and media features
- **lectures** - Talks and presentations
- **exhibitions** - Gallery shows and exhibitions
- **staff** - Team updates (new hires, departures, etc.)

### Adding a New Entry

1. Navigate to `entries/{type}/` (e.g., `entries/news/`)
2. Create a folder with the entry name (use kebab-case): `my-entry-name/`
3. Create a markdown file with the same name: `my-entry-name.md`
4. Add frontmatter and content

### Frontmatter Reference

**Required fields (all entries):**
```yaml
---
draft: false
title: "Entry Title"
date: 2024-01-15
---
```

**Common optional fields:**
```yaml
subtitle: "Brief tagline shown below title"  # Displayed in Column 2
categories:                                   # Displayed in Column 3
  - HOUSING
  - DESIGN
position: 1  # Sort order (lower = first)
```

### Metadata by Entry Type

The comprehensive index displays entries in two main categories:

**Projects** (`entries/projects/`)
- Get individual detail pages at `/project/{slug}/`
- Display collaborators in Column 3 (below categories)

```yaml
---
draft: false
title: "Project Name"
subtitle: "Brief tagline"        # Shown in Column 2
date: 2024-01-15
year: 2024                        # Optional: display year instead of full date
categories:
  - HOUSING
  - SUSTAINABLE
collaborators:                    # Shown in Column 3
  - name: "Partner Name"
    role: "Structural Engineer"
  - name: "Another Partner"
    role: "General Contractor"
position: 1
---
```

**Updates** (`entries/news/`, `awards/`, `features/`, `lectures/`, `exhibitions/`, `staff/`)
- Index-only display (no individual pages)
- Display description in Column 3 (below categories)
- Can link to external URLs

```yaml
---
draft: false
title: "Update Title"
subtitle: "Brief tagline"         # Shown in Column 2
description: "Short description"  # Shown in Column 3
date: 2024-01-15
categories:
  - AWARD
  - NEWS
link: "https://external-url.com"  # Makes title clickable (opens in new tab)
position: 2
---
```

**Field Usage Summary:**
- `subtitle` - Brief tagline shown in Column 2 below title (all entries)
- `collaborators` - Array of partners shown in Column 3 for **Projects only**
- `description` - Short text shown in Column 3 for **Updates only**
- `link` - External URL for Updates (makes title clickable)
- `year` - For projects, can be used instead of full date

### Adding Images

Drop an image file in the entry folder for automatic thumbnail:
- `header.jpg` or `header.png` - Preferred naming
- `thumb.jpg` or `thumb.png` - Alternative naming
- Any image file will work as fallback

For **projects only**, additional images are auto-discovered for the gallery on the detail page.

### Example: Adding a News Entry

```
entries/news/emerging-voices-award/
├── emerging-voices-award.md
└── thumb.jpg
```

```yaml
# emerging-voices-award.md
---
draft: false
title: "Emerging Voices Award"
subtitle: "Architectural League of New York"
date: 2021-12-31
categories:
  - AWARD
  - NEWS
link: "https://archleague.org/..."
---

LowDO has been selected for the Architectural League's Emerging Voices program...
```

## Development Commands

```bash
npm start              # Start development server
npm run build          # Production build
netlify dev            # Full Netlify dev environment
```

## Links

- **Live Site**: https://lowdo.netlify.app
- **Contact**: lowdo@lowdo.net
- **Instagram**: @lowdesignoffice
