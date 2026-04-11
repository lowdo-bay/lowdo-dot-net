---
draft: true
title: Exhibition Title
subtitle: Gallery or Venue Name
description: Brief description of the exhibition
date: 2024-01-15T00:00:00.000Z
categories:
  - ART
link: 'https://example.com/exhibition-page'
relatedProjects:
  - ''
type: exhibition
---

Optional: Add details about the exhibition here.

This text appears when someone expands the entry in the comprehensive index.

You can include:
- Exhibition theme and concept
- Works or projects displayed
- Venue information
- Duration and dates
- Curator or organizer details
- Reception or opening details

---

## Link to a Project

To show this exhibition on one or more project pages, list each project's folder name under `relatedProjects`:

```yaml
# One project:
relatedProjects:
  - mishpocha-woods

# Multiple projects:
relatedProjects:
  - mishpocha-woods
  - casa-marianella
```

The exhibition will appear in the "Awards & Recognition" section of each listed project page.

---

## How to Use This Template

1. Duplicate this entire folder
2. Rename folder and `.md` file (e.g., `gallery-show-2024`)
3. Edit frontmatter fields above
4. Add optional image: `header.jpg` or `thumb.jpg`
5. Change `draft: true` to `draft: false` to publish
6. Delete these instructions before publishing

See [Adding News/Awards](../../docs/02-adding-content/adding-updates.md) for help.
