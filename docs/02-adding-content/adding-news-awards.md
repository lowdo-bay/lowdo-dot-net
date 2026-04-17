# How to Add News, Awards, and Other Updates

Non-project entries (news, awards, features, lectures, exhibitions, staff) appear in the comprehensive index at `/all/` but do not get their own detail pages.

---

## Entry Types

| Type | Use for |
|------|---------|
| **news** | Studio announcements, partnerships, office updates |
| **award** | Design awards, competition wins, professional honors |
| **feature** | Magazine articles, podcast appearances, book mentions |
| **lecture** | University talks, conference presentations, workshops |
| **exhibition** | Art installations, gallery shows, museum exhibitions |
| **staff** | New hires, promotions, departures |

---

## Step 1: Open the Admin Panel

Go to `/admin/` and log in. Click **+ New Entry** in the top-right corner.

---

## Step 2: Fill In the Details

Click **Edit** on the new row to open the side panel. Fill in:

| Field | Required | Notes |
|-------|----------|-------|
| Title | ✅ | Entry heading |
| Type | ✅ | news, award, feature, lecture, exhibition, or staff |
| Date | ✅ | When this happened |
| Subtitle | — | Short tagline shown below the title |
| Description | — | 1–2 sentence summary shown in the index |
| Categories | — | Topic tags (e.g. AWARD, PRESS, LECTURE) |
| Link | — | External URL — makes the title clickable |
| Related Projects | — | Links this entry to one or more project pages |

Click **Apply Changes** when done.

---

## Step 3: Save

Click **Save Changes** (top right). The site rebuilds in 3–5 minutes and the entry appears in the index at `/all/`.

---

## Step 4: Add a Thumbnail (Optional)

Thumbnails are uploaded directly to GitHub:

1. Go to [github.com/lowdo-bay/lowdo-dot-net](https://github.com/lowdo-bay/lowdo-dot-net)
2. Navigate to `entries/other/{your-entry-slug}/`
3. Click **Add file → Upload files**
4. Upload an image named `header.jpg` or `thumb.jpg`

---

## Linking to Projects

Use **Related Projects** to make an award, feature, or news item appear in a project's "Awards & Recognition" section. In the edit panel, type the project slug to search and add it.

---

## Tips

**External links** — The `link` field makes the title clickable and opens in a new tab. Always use full URLs starting with `https://`. Useful for awards with announcement pages, press on external sites, event pages.

**Descriptions** — Keep it to 1–2 sentences. This text appears in Column 3 of the index.

**Categories** — Use consistent categories to keep filters useful. Common ones: `AWARD`, `PRESS`, `LECTURE`, `EXHIBITION`. See [Category Guidelines](../07-reference/category-guidelines.md).

---

## Troubleshooting

**"My entry doesn't appear in the index"**
- Check that the draft toggle is grey (published), not red
- Wait 3–5 minutes for the rebuild after saving

**"The link doesn't work"**
- Make sure it starts with `https://`

See [Common Issues](../06-troubleshooting/common-issues.md) for more help.

---

> **Advanced: How it works under the hood**
>
> The admin panel writes a markdown file to `entries/other/{slug}/{slug}.md` on GitHub. The `type:` field in the frontmatter determines how it's displayed in the index. You can edit these files directly on GitHub — see [Frontmatter Reference](frontmatter-reference.md) for the full field list.
