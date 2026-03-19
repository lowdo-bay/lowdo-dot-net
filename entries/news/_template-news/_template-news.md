---
draft: true
title: "Your News Title"
subtitle: "Brief context or tagline"
description: "Short summary that appears in the index"
date: 2024-01-15
categories:
  - STUDIO
link: "https://example.com/optional-external-link"
relatedProjects:    # Optional: link this news to one or more projects
  - ""              # Use the project folder name (slug), e.g. "river-house"
position: 1
---

Write your news content here (optional).

This text appears when someone expands the entry in the comprehensive index.

You can include:
- Announcement details
- Background information
- Links to related content
- Contact information

Keep it concise - news entries don't get their own pages, they only appear in the index.

---

## Link to a Project

To show this news item on one or more project pages, list each project's folder name under `relatedProjects`:

```yaml
# One project:
relatedProjects:
  - river-house

# Multiple projects:
relatedProjects:
  - river-house
  - garden-st-residence
```

The news will appear in the "Awards & Recognition" section of each listed project page.

---

## How to Use This Template

1. Duplicate this entire folder
2. Rename folder and `.md` file (e.g., `studio-expansion`)
3. Edit frontmatter fields above
4. Add optional image: `header.jpg` or `thumb.jpg`
5. Change `draft: true` to `draft: false` to publish
6. Delete these instructions before publishing

See [Adding News/Awards](../../docs/02-adding-content/adding-updates.md) for help.
