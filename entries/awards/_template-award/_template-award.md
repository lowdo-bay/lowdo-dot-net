---
draft: true
title: "Award Name"
subtitle: "Awarding Organization"
description: "Brief description of the award or recognition"
date: 2024-01-15
categories:
  - PRESS
link: "https://example.com/award-announcement"
relatedProjects:    # Optional: link this award to one or more projects
  - ""              # Use the project folder name (slug), e.g. "wolf-creek-ranch"
position: 
featured: false
---

Optional: Add more details about the award here.

This text appears when someone expands the entry in the comprehensive index.

You can include:
- Significance of the award
- Selection criteria
- Context or background
- Related projects or work

---

## Link to a Project

To show this award on one or more project pages, list each project's folder name under `relatedProjects`:

```yaml
# One project:
relatedProjects:
  - wolf-creek-ranch

# Multiple projects:
relatedProjects:
  - wolf-creek-ranch
  - casa-marianella
```

The award will appear in the "Awards & Recognition" section of each listed project page.

---

## How to Use This Template

1. Duplicate this entire folder
2. Rename folder and `.md` file (e.g., `emerging-voices-2024`)
3. Edit frontmatter fields above
4. Add optional image: `header.jpg` or `thumb.jpg`
5. Change `draft: true` to `draft: false` to publish
6. Delete these instructions before publishing

See [Adding News/Awards](../../docs/02-adding-content/adding-updates.md) for help.
