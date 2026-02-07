# How to Add News, Awards, and Other Updates

Step-by-step guide for adding non-project entries (news, awards, features, lectures, exhibitions, staff updates).

---

## Entry Types

These entry types appear ONLY in the comprehensive index (they don't get their own pages):

- **News** - Studio announcements and updates
- **Awards** - Honors and recognitions
- **Features** - Press coverage and publications
- **Lectures** - Talks, presentations, speaking engagements
- **Exhibitions** - Gallery shows and installations
- **Staff** - Team updates (new hires, departures, promotions)

---

## Difference from Projects

| Aspect | Projects | Updates (News, Awards, etc.) |
|--------|----------|------------------------------|
| **Get own page?** | ✅ Yes (`/project/{name}/`) | ❌ No (index only) |
| **Gallery** | ✅ Multiple images | ❌ Thumbnail only |
| **External links** | ❌ Internal only | ✅ Can link out |
| **Collaborators** | ✅ Has collaborators field | ❌ No collaborators |
| **Description** | Short summary | Shows in index Column 3 |

---

## Step-by-Step Instructions

### Step 1: Choose the Right Folder

Navigate to the appropriate folder for your entry type:

| Type | Folder |
|------|--------|
| News | `entries/news/` |
| Award | `entries/awards/` |
| Feature | `entries/features/` |
| Lecture | `entries/lectures/` |
| Exhibition | `entries/exhibitions/` |
| Staff | `entries/staff/` |

---

### Step 2: Create a Folder

Create a new folder with a descriptive name.

**Same naming rules as projects:**
- Lowercase letters only
- Hyphens instead of spaces
- Be descriptive

✅ Good: `emerging-voices-award`, `austin-chronicle-feature`, `ut-lecture-2024`
❌ Bad: `Award 1`, `new_award`, `EMERGING VOICES`

**Example:**
```
entries/awards/emerging-voices-award/
```

---

### Step 3: Create a Markdown File

Inside the folder, create a `.md` file with the **same name** as the folder.

✅ Correct:
```
emerging-voices-award/
└── emerging-voices-award.md
```

❌ Wrong:
```
emerging-voices-award/
└── award.md
```

---

### Step 4: Add Entry Information

Copy this template and fill in your details:

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
description: "LowDO selected for the prestigious Emerging Voices program"
---

Optional: You can write more details here, but they won't appear in the index.
This is useful for keeping records or adding context.
```

---

### Step 5: Add an Image (Optional)

Drop a thumbnail image in the folder.

Name it `header.jpg` or `thumb.jpg`:

```
entries/awards/emerging-voices-award/
├── emerging-voices-award.md
└── thumb.jpg                    ← Optional thumbnail
```

---

### Step 6: Save and Publish

Save the `.md` file and commit your changes with git.

See [Making Commits](../05-tools-and-workflow/making-commits.md) for details.

---

## Required Fields

| Field | What It Does | Example |
|-------|-------------|---------|
| `draft: false` | Visibility (`false` = published) | `draft: false` |
| `title: "..."` | Main heading | `title: "Emerging Voices Award"` |
| `date: YYYY-MM-DD` | When this happened | `date: 2021-12-31` |

---

## Optional Fields

| Field | What It Does | Example |
|-------|-------------|---------|
| `subtitle: "..."` | Tagline below title | `subtitle: "Architectural League"` |
| `categories: [...]` | Topic tags (all caps) | `categories:`<br>`  - AWARD` |
| `link: "https://..."` | External URL (makes title clickable) | `link: "https://example.com"` |
| `description: "..."` | Summary shown in Column 3 | `description: "LowDO selected..."` |
| `position: number` | Sort order (lower = first) | `position: 1` |

---

## Key Differences from Projects

### The `link` Field

For updates, the `link` field makes the title clickable and opens in a new tab:

```yaml
link: "https://archleague.org/article/emerging-voices/"
```

This is perfect for:
- Awards with ceremony announcements
- Press features on external sites
- Lecture event pages
- Exhibition gallery websites

### The `description` Field

For updates, the `description` appears in Column 3 of the index:

```yaml
description: "LowDO selected for the prestigious Emerging Voices program recognizing emerging architecture studios."
```

Keep it concise (1-2 sentences).

### No Collaborators

Updates don't have a `collaborators:` field. That's only for projects.

---

## When to Use Which Type

### News
General studio announcements:
- Studio expansion
- New services
- Partnerships
- Office moves

### Awards
Honors and recognitions:
- Design awards
- Competitions won
- Professional honors
- Grant recipients

### Features
When LowDO is featured externally:
- Magazine articles
- Blog posts
- Podcast appearances
- Book mentions

### Lectures
Talks and presentations:
- University lectures
- Conference talks
- Panel discussions
- Workshops

### Exhibitions
Gallery shows and installations:
- Art installations
- Design exhibitions
- Museum shows
- Pop-up displays

### Staff
Team updates:
- New hires
- Promotions
- Departures
- Anniversaries

---

## Examples

### Award Example

```yaml
---
draft: false
title: "AIA Design Award"
subtitle: "American Institute of Architects"
date: 2024-05-15
categories:
  - AWARD
  - ARCHITECTURE
link: "https://www.aia.org/awards/2024"
description: "Casa Marianella project receives AIA Design Award for community impact"
---
```

### Feature Example

```yaml
---
draft: false
title: "Austin Chronicle Feature"
subtitle: "Designing for Community"
date: 2024-03-20
categories:
  - PRESS
  - FEATURE
link: "https://www.austinchronicle.com/arts/2024-03-20/lowdo/"
description: "Profile of LowDO's community-centered design approach"
---
```

### Lecture Example

```yaml
---
draft: false
title: "UT Architecture Lecture Series"
subtitle: "Sustainable Urbanism"
date: 2024-02-10
categories:
  - LECTURE
  - EDUCATION
link: "https://soa.utexas.edu/events/lecture-series"
description: "Presentation on sustainable design strategies for urban housing"
---
```

---

## Tips

**Categories:**
- For awards, include "AWARD"
- For press, include "PRESS" or "FEATURE"
- For lectures, include "LECTURE"
- See [Category Guidelines](../07-reference/category-guidelines.md)

**External Links:**
- Always use full URLs starting with `https://`
- Test links to make sure they work
- Prefer long-term stable URLs (not temporary event pages)

**Descriptions:**
- Keep it to 1-2 sentences
- Focus on what happened and why it matters
- Avoid jargon

---

## Troubleshooting

**"My entry doesn't appear"**
- Check `draft: false`
- Check file/folder naming (must match)
- Check date format (YYYY-MM-DD)

**"The link doesn't work"**
- Check URL starts with `https://`
- Check for typos in the URL
- Test the link in a browser

**"No thumbnail shows up"**
- Add `header.jpg` or `thumb.jpg` to the folder
- Check image file extension (`.jpg`, `.png`)

See [Common Issues](../06-troubleshooting/common-issues.md) for more help.

---

## Next Steps

- **[Adding a Project](adding-a-project.md)** - For design projects
- **[Image Guide](image-guide.md)** - Image best practices
- **[Frontmatter Reference](frontmatter-reference.md)** - All available fields
- **[Entry Types Comparison](../07-reference/entry-types-comparison.md)** - Quick reference

---

## Questions?

See the [FAQ](../06-troubleshooting/faq.md) or ask a team member.
