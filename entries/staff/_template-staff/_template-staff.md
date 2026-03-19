---
draft: true
title: "Person's Name"
subtitle: "New Role or Update Type"
description: "Brief description of the update"
date: 2024-01-15
categories:
  - STAFF
  - NEWS
link: ""
relatedProjects:    # Optional: link this staff update to one or more projects
  - ""              # Use the project folder name (slug), e.g. "wolf-creek-ranch"
position: 1
---

Optional: Add more details about the staff update here.

This text appears when someone expands the entry in the comprehensive index.

You can include:
- Person's background or experience
- Their role and responsibilities
- Projects they'll work on
- Welcome message or announcement
- Contact information

---

## Link to a Project

To show this staff update on one or more project pages, list each project's folder name under `relatedProjects`:

```yaml
# One project:
relatedProjects:
  - wolf-creek-ranch

# Multiple projects:
relatedProjects:
  - wolf-creek-ranch
  - river-house
```

The staff update will appear in the "Awards & Recognition" section of each listed project page.

---

## How to Use This Template

1. Duplicate this entire folder
2. Rename folder and `.md` file (e.g., `jane-doe-joins`)
3. Edit frontmatter fields above
4. Add optional image: `header.jpg` or `thumb.jpg`
5. Change `draft: true` to `draft: false` to publish
6. Delete these instructions before publishing

See [Adding News/Awards](../../docs/02-adding-content/adding-updates.md) for help.
