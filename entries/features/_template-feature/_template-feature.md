---
draft: true
title: "Publication or Feature Title"
subtitle: "Publication Name or Context"
description: "Brief description of the feature or article"
date: 2024-01-15
categories:
  - PRESS
  - PUBLICATION
link: "https://example.com/article-url"
relatedProjects:    # Optional: link this feature to one or more projects
  - ""              # Use the project folder name (slug), e.g. "230814_casa-marianella"
position: 
---

Optional: Add context or quotes from the feature here.

This text appears when someone expands the entry in the comprehensive index.

You can include:
- Summary of the article or feature
- Key quotes or highlights
- Projects or work that was featured
- Impact or significance

---

## Link to a Project

To show this feature on one or more project pages, list each project's folder name under `relatedProjects`:

```yaml
# One project:
relatedProjects:
  - casa-marianella

# Multiple projects:
relatedProjects:
  - casa-marianella
  - river-house
```

The feature will appear in the "Awards & Recognition" section of each listed project page.

---

## How to Use This Template

1. Duplicate this entire folder
2. Rename folder and `.md` file (e.g., `architect-magazine-2024`)
3. Edit frontmatter fields above
4. Add optional image: `header.jpg` or `thumb.jpg`
5. Change `draft: true` to `draft: false` to publish
6. Delete these instructions before publishing

See [Adding News/Awards](../../docs/02-adding-content/adding-updates.md) for help.
