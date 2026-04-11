# Frontmatter Reference

Complete field-by-field guide to all frontmatter options.

---

## What is Frontmatter?

Frontmatter is the section at the top of every `.md` file between `---` lines. It contains metadata about your entry.

```yaml
---
draft: false
title: "My Project"
date: 2024-01-15
---

Content goes here below the frontmatter.
```

Think of frontmatter as a form that tells the system about your content.

---

## Required Fields

Every entry MUST have these fields:

| Field | What It Does | Format | Example |
|-------|-------------|--------|---------|
| `type` | Entry type — controls filter label and project-only features | Lowercase text | `type: award` |
| `draft` | Controls visibility | `true` or `false` | `draft: false` |
| `title` | Main heading | Text in quotes | `title: "Casa Marianella"` |
| `date` | When it happened | YYYY-MM-DD | `date: 2023-06-15` |

### type

**What it does:** Sets the entry's type — determines its filter label in the index and which fields apply (e.g. only projects get galleries and collaborators).

**Format:** Lowercase text, no quotes

**Standard values:** `project`, `news`, `award`, `feature`, `lecture`, `exhibition`, `staff`

**Custom values:** You can invent any type — it will appear as a filter option automatically.

**Example:**
```yaml
type: award
```

**Note:** Entries in `entries/projects/` should use `type: project`. All other entries live in `entries/other/` and use any other type value.

---

### draft

**What it does:** Controls whether the entry appears on the site.

**Values:**
- `draft: false` — Published (visible on site)
- `draft: true` — Hidden (won't appear in index or have a page)

**When to use `draft: true`:**
- Work in progress
- Content not ready to publish
- Outdated entries you want to hide (but not delete)

**Example:**
```yaml
draft: false
```

### title

**What it does:** The main name/heading shown everywhere (index, project pages, navigation).

**Format:** Text in quotes

**Tips:**
- Keep it concise (2-6 words usually)
- Use title case: "Casa Marianella" not "casa marianella"
- Don't include taglines here (use `subtitle` instead)

**Example:**
```yaml
title: "Wolf Creek Ranch"
```

### date

**What it does:** When this entry happened. Determines sort order (newest first by default).

**Format:** YYYY-MM-DD (four-digit year, two-digit month, two-digit day)

**Examples:**
```yaml
date: 2023-06-15
date: 2024-01-01
date: 2022-12-31
```

**Note:** For projects, you can use `year` instead if you only want to show the year.

---

## Common Optional Fields

These fields work for ALL entry types:

### subtitle

**What it does:** Tagline or brief description shown below the title.

**Format:** Text in quotes

**Example:**
```yaml
subtitle: "Community Housing and Resource Center"
```

**Tips:**
- Keep it short (3-8 words)
- Adds context without cluttering the title
- Appears in Column 2 of the index, below the title

### categories

**What it does:** Topic tags that help visitors filter content.

**Format:** List of items (all caps, no quotes on individual items)

**Example:**
```yaml
categories:
  - HOUSING
  - COMMUNITY
  - SUSTAINABLE
```

**Tips:**
- Use ALL CAPS
- Use existing categories when possible (keeps filters organized)
- 2-4 categories per entry is typical
- See [Category Guidelines](../07-reference/category-guidelines.md)

### position

**What it does:** Overrides date-based sorting. Lower numbers appear first.

**Format:** Number (no quotes)

**Example:**
```yaml
position: 1
```

**When to use:**
- Feature a specific entry at the top
- Control order of entries with the same date
- Group related entries together

**Default:** Entries are sorted by date (newest first) if no `position` is set.

---

## Project-Specific Fields

These fields ONLY work for entries with `type: project` in `entries/projects/`:

### year

**What it does:** Show only the year instead of the full date in the index.

**Format:** Four-digit number (no quotes)

**Example:**
```yaml
year: 2023
```

**When to use:**
- When exact date isn't important
- When you only know the year
- For cleaner display in the index

**Note:** Still include `date` for sorting purposes.

### collaborators

**What it does:** Lists partners, contractors, engineers, etc. who worked on the project.

**Format:** List of objects with `name` and `role`

**Example:**
```yaml
collaborators:
  - name: "Structural Innovations"
    role: "Structural Engineer"
  - name: "GreenBuild Contractors"
    role: "General Contractor"
  - name: "EcoDesign Consultants"
    role: "Sustainability Consultant"
```

**Display:** Shows in Column 3 of the index, below categories.

**Tips:**
- Use quotes around names and roles
- List primary collaborators first
- Be specific with roles

### location

**What it does:** Geographic location of the project.

**Format:** Text in quotes

**Example:**
```yaml
location: "Austin, TX, USA"
```

**Tips:**
- Be specific: city, state, country
- Optional but helpful for context

### status

**What it does:** Current status of the project (Built, In Progress, Proposed, etc.).

**Format:** Text in quotes

**Example:**
```yaml
status: "Built"
```

**Tips:**
- Use consistent values: "Built", "In Progress", "Proposed", "Concept"
- Helps visitors understand project phase

### featured

**What it does:** Marks a project as featured so it appears in the Featured Projects section on the homepage.

**Format:** `true` or `false` (no quotes)

**Example:**
```yaml
featured: true
```

**Tips:**
- `featured: true` — project appears in the Featured Projects section on the homepage
- `featured: false` (default) — normal display only
- Add a `featured.jpg` to the project folder to use a different image on the homepage than the main `header.jpg` (see [Image Guide](image-guide.md))

### featuredPosition

**What it does:** Controls the display order of projects within the Featured Projects section on the homepage.

**Format:** Number (no quotes)

**Example:**
```yaml
featuredPosition: 1
```

**When to use:**
- Control which featured project appears first, second, etc.
- Override the default order (which follows the global `position` field)

**Default:** Projects without `featuredPosition` sort after those that have it set.

**Note:** Only applies to projects with `featured: true`.

### description (Projects)

**What it does:** Short project summary.

**Format:** Text in quotes

**Example:**
```yaml
description: "A community resource center providing housing and support services for immigrants and refugees"
```

**Tips:**
- 1-2 sentences
- Focus on what the project is, not how great it is
- Avoid jargon

---

## Update-Specific Fields

These fields work for non-project entries (news, award, feature, lecture, exhibition, staff):

### link

**What it does:** External URL. Makes the title clickable and opens in a new tab.

**Format:** Full URL in quotes starting with `https://`

**Example:**
```yaml
link: "https://archleague.org/article/emerging-voices-2022/"
```

**When to use:**
- Award ceremony announcements
- Press articles on external sites
- Lecture event pages
- Exhibition gallery websites

**Tips:**
- Always use full URL (including `https://`)
- Test the link to make sure it works
- Prefer stable URLs (not temporary event pages)

### description (Updates)

**What it does:** Summary text shown in Column 3 of the index.

**Format:** Text in quotes

**Example:**
```yaml
description: "LowDO selected for the prestigious Emerging Voices program recognizing emerging architecture studios"
```

**Tips:**
- 1-2 sentences
- Concise and informative
- Appears in the index, not on a detail page (updates don't have detail pages)

### relatedProjects

**What it does:** Links an award, feature, news, or other entry to one or more projects. The entry will appear in the "Awards & Recognition" section on each linked project page.

**Format:** List of project folder slugs (no quotes needed on list items)

**Example — one project:**
```yaml
relatedProjects:
  - wolf-creek-ranch
```

**Example — multiple projects:**
```yaml
relatedProjects:
  - wolf-creek-ranch
  - casa-marianella
  - river-house
```

**When to use:**
- Linking awards to the projects they recognize
- Connecting press features to related projects
- Showing lectures or exhibitions related to specific projects
- Any time you want an entry to appear in a project's "Awards & Recognition" section

**Tips:**
- Use the **folder name** of the project (the slug in the URL, e.g. `/project/wolf-creek-ranch/` → `wolf-creek-ranch`)
- Only works for non-project entries in `entries/other/`
- The entry will display on each project page with its title, categories, and date
- If the entry has a `link` field, the title will be clickable

**Example: Linking an award to multiple projects**

In `entries/awards/design-excellence/design-excellence.md`:
```yaml
---
draft: false
title: "Design Excellence Award"
subtitle: "American Institute of Architects"
date: 2024-05-15
categories:
  - AWARD
relatedProjects:
  - wolf-creek-ranch
  - casa-marianella
link: "https://example.com"
---
```

The award will appear in the "Awards & Recognition" section of both `/project/wolf-creek-ranch/` and `/project/casa-marianella/`.

---

## Field Type Guide

### Text (String)

Use quotes around text values:

```yaml
title: "My Title"
subtitle: "My Subtitle"
description: "Description text here"
```

### Number

No quotes for numbers:

```yaml
position: 1
year: 2023
```

### True/False (Boolean)

No quotes:

```yaml
draft: false
draft: true
```

### List (Array)

Use dashes and indentation:

```yaml
categories:
  - HOUSING
  - DESIGN
  - SUSTAINABLE
```

Each item on a new line, indented, starting with `-`.

### List of Objects

Nested structure with dashes and indentation:

```yaml
collaborators:
  - name: "Partner Name"
    role: "Their Role"
  - name: "Another Partner"
    role: "Another Role"
```

Each object starts with `-`, properties indented below.

---

## Complete Examples

### Project Example

```yaml
---
draft: false
title: "Wolf Creek Ranch"
subtitle: "Residential Development"
date: 2022-11-20
year: 2022
categories:
  - HOUSING
  - SUSTAINABLE
  - RESIDENTIAL
collaborators:
  - name: "Structural Innovations"
    role: "Structural Engineer"
  - name: "EcoDesign Consultants"
    role: "Sustainability Consultant"
description: "A sustainable residential development in the Texas Hill Country"
position: 1
featured: true
featuredPosition: 1
---
```

### Award Example

```yaml
---
draft: false
title: "Emerging Voices Award"
subtitle: "Architectural League of New York"
date: 2021-12-31
categories:
  - AWARD
  - PRESS
link: "https://archleague.org/article/emerging-voices/"
description: "Selected for prestigious Emerging Voices program"
---
```

### News Example

```yaml
---
draft: false
title: "Studio Expansion"
subtitle: "New Office in East Austin"
date: 2024-01-10
categories:
  - NEWS
  - STUDIO
description: "LowDO opens second office location to better serve East Austin community"
---
```

---

## Common Mistakes

### ❌ Wrong: Missing quotes

```yaml
title: Casa Marianella
subtitle: Community Housing
```

**✅ Correct:**
```yaml
title: "Casa Marianella"
subtitle: "Community Housing"
```

### ❌ Wrong: Wrong date format

```yaml
date: 01/15/2023
date: Jan 15, 2023
```

**✅ Correct:**
```yaml
date: 2023-01-15
```

### ❌ Wrong: Quotes on numbers

```yaml
year: "2023"
position: "1"
```

**✅ Correct:**
```yaml
year: 2023
position: 1
```

### ❌ Wrong: Inconsistent indentation

```yaml
categories:
- HOUSING
  - DESIGN
```

**✅ Correct:**
```yaml
categories:
  - HOUSING
  - DESIGN
```

### ❌ Wrong: Using collaborators for non-projects

```yaml
# In entries/news/announcement/
collaborators:
  - name: "Someone"
```

**✅ Correct:** Collaborators only work in `entries/projects/`

---

## Validation

If your entry doesn't appear or looks wrong:

1. **Check indentation** - Use 2 spaces, not tabs
2. **Check quotes** - Text needs quotes, numbers/booleans don't
3. **Check format** - Date must be YYYY-MM-DD
4. **Check syntax** - Use a YAML validator: https://www.yamllint.com/

---

## Next Steps

- **[Adding a Project](adding-a-project.md)** - Use these fields in practice
- **[Adding News/Awards](adding-news-awards.md)** - For non-project entries
- **[Category Guidelines](../07-reference/category-guidelines.md)** - Choose categories

---

## Questions?

See [Common Issues](../06-troubleshooting/common-issues.md) for troubleshooting.
