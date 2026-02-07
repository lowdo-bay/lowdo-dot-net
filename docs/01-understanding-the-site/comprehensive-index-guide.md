# Comprehensive Index Feature Summary

This guide explains how the Comprehensive Index works, how entries are created and modified, and how the filtering system operates.

---

## Overview: What Is the Comprehensive Index?

The Comprehensive Index is a unified, filterable page at `/all/` that displays all studio activities and projects in a spreadsheet-like layout. Instead of having separate "news," "awards," and "projects" pages scattered throughout the site, everything lives in one organized place where visitors can browse, filter, and discover all of LowDO's work.

Think of it as a database view of all studio happenings—projects, awards, lectures, exhibitions, news, publications, and staff updates—all in one scannable table.

---

## How to Create and Modify Entries

The system is designed so non-technical team members can add content without touching code:

### Step 1: Create a Folder

Navigate to the `entries/` folder and choose the appropriate subfolder based on what you're adding:

- `entries/projects/` — Design and architecture projects (get their own detail pages)
- `entries/news/` — Studio announcements and news items
- `entries/awards/` — Awards and recognitions
- `entries/features/` — Press coverage and publications
- `entries/lectures/` — Talks and presentations
- `entries/exhibitions/` — Gallery shows and exhibitions
- `entries/staff/` — Team updates (new hires, departures, etc.)

Create a new folder using lowercase with hyphens (kebab-case):
```
entries/awards/emerging-voices-award/
```

### Step 2: Create a Markdown File

Inside that folder, create a markdown file with the **same name** as the folder:
```
entries/awards/emerging-voices-award/emerging-voices-award.md
```

### Step 3: Add Content and Metadata

At the top of the markdown file, add metadata (called "frontmatter") between `---` lines:

```yaml
---
draft: false
title: "Emerging Voices Award"
subtitle: "Architectural League of New York"
date: 2021-12-31
categories:
  - AWARD
  - PRESS
link: "https://archleague.org/article/emerging-voices-2022/"
---

Below the frontmatter, write the description text that appears on the entry...
```

**Required fields:**
- `draft: false` — Set to `true` to hide the entry (useful for works-in-progress)
- `title` — The main heading that appears in the index
- `date` — When this happened (format: YYYY-MM-DD)

**Common optional fields:**
- `subtitle` — Secondary text shown below the title
- `categories` — Topic tags (shown in all caps, e.g., HOUSING, SUSTAINABLE, AWARD)
- `position` — Sort order; lower numbers appear first (default: sorted by date)
- `link` — External URL that makes the title clickable (opens in new tab)
- `description` — Short summary text (for non-project entries)

**Project-specific fields:**
- `year: 2024` — Show just the year instead of full date
- `collaborators` — List of partners who worked on the project:
  ```yaml
  collaborators:
    - name: "Partner Name"
      role: "Structural Engineer"
    - name: "Another Partner"
      role: "General Contractor"
  ```

### Step 4: Add Images (Automatic!)

Simply drop image files into the same folder as the markdown file:

- Name the main image `header.jpg` or `thumb.jpg` (preferred)
- Or use any image filename—the system will auto-detect it
- For **projects only**, all images in the folder are automatically added to a gallery on the detail page

**No code changes needed!** The system discovers images automatically.

---

## Entry Types and Their Differences

| Entry Type | Gets Detail Page? | What Shows in Column 3 |
|------------|-------------------|------------------------|
| **Project** | ✅ Yes (`/project/{name}/`) | Type tags + Categories + Collaborators |
| **News** | ❌ Index only | Type tags + Categories + Description text |
| **Award** | ❌ Index only | Type tags + Categories + Description text |
| **Feature** | ❌ Index only | Type tags + Categories + Description text |
| **Lecture** | ❌ Index only | Type tags + Categories + Description text |
| **Exhibition** | ❌ Index only | Type tags + Categories + Description text |
| **Staff** | ❌ Index only | Type tags + Categories + Description text |

**Key Difference:** Projects are special because they get their own showcase pages with image galleries. All other entry types appear only in the comprehensive index.

---

## How the Index Page is Organized

The index displays entries in a four-column spreadsheet layout (on desktop; single column on mobile):

```
┌─────────────┬────────────────────────┬──────────────────────────────┬──────────┐
│   IMAGE     │   ITEM                 │   DETAILS / DESCRIPTION      │   DATE   │
├─────────────┼────────────────────────┼──────────────────────────────┼──────────┤
│ [Thumbnail] │ Title (bold)           │ PROJECT, HOUSING, SUSTAINABLE│ 01.15    │
│             │ Subtitle (smaller)     │ Partner Name - Role          │ 2024     │
│             │ (clickable if project) │ Another Partner - Role       │          │
└─────────────┴────────────────────────┴──────────────────────────────┴──────────┘
```

**Column 1 — Image**
- Thumbnail from the entry folder
- Automatically lazy-loaded for fast page performance

**Column 2 — Item Title & Subtitle**
- Entry title in bold
- Subtitle below (if provided)
- Projects link to their detail pages
- Updates with external links are clickable (open in new tab)

**Column 3 — Details**
- **For Projects:** Entry type + categories + list of collaborators
- **For Updates:** Entry type + categories + description text

**Column 4 — Date**
- Month and day (MM.DD format, e.g., "01.15")
- Year on a separate line

---

## How Filtering Works

The index has a two-tier filtering system to help visitors discover specific types of work:

### Tier 1: Entry Type Filters (Always Visible)

Checkboxes for each type of entry present in the index:
- **ALL** (selected by default—shows everything)
- **PROJECT**
- **NEWS**
- **AWARD**
- **FEATURE**
- **LECTURE**
- **EXHIBITION**
- **STAFF**

These are automatically generated from the folder structure. If you add a new type by creating a new subfolder in `entries/`, it will automatically appear as a filter option.

### Tier 2: Category Filters (Hidden by Default)

Checkboxes for each category tag used in entry frontmatter:
- Examples: **HOUSING**, **SUSTAINABLE**, **DESIGN**, **EDUCATION**, etc.
- Hidden behind a "show more..." toggle to keep the interface clean
- Click "show more..." to expand; click "show less..." to collapse

These are automatically generated from the `categories` field in your frontmatter. Any new category you add to an entry will automatically appear in the filter list.

### How Filtering Behaves

1. **Default State:** "ALL" is checked → shows all entries
2. **Selecting Filters:** Click any type or category → "ALL" unchecks, only matching entries show
3. **Multiple Filters:** Check multiple filters → entries must match ANY selected filter to show
4. **Clearing Filters:** Uncheck all filters → "ALL" automatically re-checks → everything shows again
5. **Direct Links:** You can link directly to filtered views:
   - `/all/?type=project` → shows only projects
   - `/all/?category=housing` → shows only housing-related entries

**Technical Note:** Filtering happens instantly with JavaScript (no page reload). If a visitor has JavaScript disabled, they see all entries.

---

## Real-World Example: Adding an Award

Let's walk through adding an award announcement:

**1. Create the folder:**
```
entries/awards/emerging-voices-award/
```

**2. Create the markdown file:**
```
entries/awards/emerging-voices-award/emerging-voices-award.md
```

**3. Add content:**
```yaml
---
draft: false
title: "Emerging Voices Award"
subtitle: "Architectural League of New York"
date: 2021-12-31
categories:
  - AWARD
  - PRESS
link: "https://archleague.org/article/emerging-voices-2022/"
description: "LowDO selected for prestigious emerging voices program"
---

LowDO has been selected for the Architectural League's Emerging Voices program,
which recognizes North American architects with distinct design voices and
significant bodies of realized work.
```

**4. Add an image (optional):**
```
entries/awards/emerging-voices-award/thumb.jpg
```

**Result in the index:**

```
┌────────────┬─────────────────────────────┬──────────────────────────┬────────┐
│ [Image]    │ Emerging Voices Award       │ AWARD, PRESS             │ 12.31  │
│            │ Architectural League of NY  │ LowDO selected for...    │ 2021   │
│            │ (clickable → external link) │                          │        │
└────────────┴─────────────────────────────┴──────────────────────────┴────────┘
```

---

## Behind the Scenes: How It Works

When you add a markdown file to `entries/`, here's what happens automatically:

1. **Discovery:** Build system (Eleventy) finds your file
2. **Type Detection:** Folder path determines entry type (e.g., `entries/awards/` → "AWARD")
3. **Image Detection:** System looks for `header.*`, `thumb.*`, or any image in the folder
4. **Metadata Extraction:** Frontmatter values are read (title, date, categories, etc.)
5. **Collection Building:** Entry is added to the unified "entries" collection
6. **Page Generation:**
   - Projects get detail pages at `/project/{slug}/`
   - Other entries are index-only (no individual page)
7. **Index Rendering:** All entries appear in the comprehensive index at `/all/`
8. **Filter Generation:** Unique entry types and categories become filter options

**All of this is automatic.** You never need to manually register an entry, update a list, or configure anything. Just add the file and rebuild the site.

---

## Why This Design Works

1. **Zero Code Required** — Team members just create folders and write markdown
2. **Automatic Everything** — No manual lists to update; system discovers files and images
3. **Flexible Metadata** — Simple entries only need title and date; complex entries can add more fields
4. **One Source of Truth** — All studio activity lives in one scannable view
5. **Multiple Discovery Paths** — Browse by type, by category, by date, or see everything
6. **Project Showcase** — Important projects get dedicated pages; routine updates stay in the index
7. **External Integration** — Awards and press can link to external sources without hosting everything locally

---

## Common Tasks

**Adding a project:**
1. Create `entries/projects/my-project/my-project.md`
2. Add frontmatter with title, date, categories, collaborators
3. Drop images in the folder
4. Rebuild site → project appears in index AND gets detail page at `/project/my-project/`

**Adding news:**
1. Create `entries/news/my-news/my-news.md`
2. Add frontmatter with title, date, description
3. Optionally add external link
4. Rebuild site → appears in index only

**Hiding an entry:**
- Set `draft: true` in frontmatter
- Rebuild site → entry disappears from index

**Changing sort order:**
- Add `position: 1` to frontmatter (lower numbers = earlier in list)
- Rebuild site → entry moves to new position

**Adding a new category:**
- Add to `categories:` list in any entry's frontmatter
- Rebuild site → new category appears in filters automatically

---

This system achieves the design goal: **"The site must be easily edited. The workflow to update the website should involve the user dropping in text and images into a folder and letting the code automatically generate a page."**
