---
draft: true
featured: false
featuredPosition:  # Control the order of featured projects on the homepage.
title: "Your Project Name"
description: "A short summary of the project (1-2 sentences)"
date: 2024-01-15
year: 2024
categories:
  - HOUSING
  - SUSTAINABLE
location: ""  # e.g., "Austin, TX"
status: ""    # e.g., "Built", "In Progress"
collaborators:
  - name: "Partner Name"
    role: "Structural Engineer"
  - name: "Another Partner"
    role: "General Contractor"
position:
---

Write your project description here. This text appears on the project detail page below the header image.

You can write multiple paragraphs to tell the story of your project.

## Project Details

Add sections with ## headings to organize your content.

Describe:
- Project goals and vision
- Design approach and process
- Key challenges and solutions
- Materials and sustainability features

## Design Approach

Continue adding sections as needed.

Use simple markdown formatting:
- **Bold text** with double asterisks
- *Italic text* with single asterisks
- `code or technical terms` with backticks

Keep paragraphs short for readability on the web.

---

## How to Use This Template

1. Duplicate this entire folder
2. Rename folder and `.md` file to match your project (e.g., `my-project-name`)
3. Edit frontmatter (metadata between `---` lines)
4. Add images (see image naming conventions below)
5. Change `draft: true` to `draft: false` to publish
6. Delete these instructions before publishing

**Image File Naming:**

| Name | Purpose | Example |
|------|---------|---------|
| `header.jpg` | Main thumbnail | `header.jpg` |
| `00_`, `01_`, etc. | Gallery photos (numbered) | `00_Exterior view.jpg` |
| `drawing-` | Floor plans, drawings | `drawing-plan_1.jpg` |
| `toolkit-` | Reference files (CAD, PDF) | `toolkit-framing-plan.dwg` |

## Awards & Recognition

Projects automatically display a section showing related awards, features, and other recognitions. To link awards or news to this project:

1. Create an award, feature, news, or other entry in the appropriate `entries/` folder
2. Add this field to its frontmatter using the folder name of this project:
   ```yaml
   relatedProjects:
     - your-project-slug
   ```
3. Save and publish

The award/news will appear in the "Awards & Recognition" section of this project page. An entry can link to multiple projects by listing more slugs.

**Example:**
```yaml
# In entries/awards/my-award.md
---
title: "Design Excellence Award"
relatedProjects:
  - wolf-creek-ranch   # Links to this project
  - river-house        # Also links to another project
---
```

See [Adding a Project](../../docs/02-adding-content/adding-a-project.md) guide for detailed help.
