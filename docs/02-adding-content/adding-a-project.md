# How to Add a Project

Projects get their own detail pages with image galleries and appear in the comprehensive index at `/all/`.

---

## Step 1: Open the Admin Panel

Go to `/admin/` and log in. Click **+ New Entry** in the top-right corner. A new blank row appears in the table.

---

## Step 2: Fill In the Details

Click **Edit** on the new row to open the side panel. Fill in:

| Field | Required | Notes |
|-------|----------|-------|
| Title | ✅ | Main project name |
| Type | ✅ | Set to **project** |
| Date | ✅ | Project completion date |
| Subtitle | — | Brief tagline shown below the title |
| Year | — | Display year instead of full date |
| Description | — | Short summary shown in the index |
| Categories | — | Topic tags — use existing ones when possible |
| Collaborators | — | Name + role pairs for project partners |
| Status | — | Built / In Progress / Proposed |
| Location | — | Geographic location |
| Body Text | — | Full project description (supports markdown) |

Click **Apply Changes** when done.

---

## Step 3: Save

Click **Save Changes** (top right). All pending changes are committed to GitHub in a single operation. The site rebuilds automatically in 3–5 minutes.

After saving, the project appears at `/project/{slug}/` and in the index at `/all/`.

---

## Step 4: Add Images

Images are added directly to the GitHub repository in the project's folder. You can do this through the GitHub web interface:

1. Go to [github.com/lowdo-bay/lowdo-dot-net](https://github.com/lowdo-bay/lowdo-dot-net)
2. Navigate to `entries/projects/{your-project-slug}/`
3. Click **Add file → Upload files**
4. Upload your images and commit

**Naming conventions:**

| Name | Purpose |
|------|---------|
| `header.jpg` or `thumb.jpg` | Main thumbnail shown in index and top of project page |
| `00_description.jpg`, `01_description.jpg`, … | Gallery images (numbered for sort order) |
| `drawing-plan.jpg` | Floor plans and architectural drawings |

See [Image Guide](image-guide.md) for sizes and formats.

---

## Tips

**Categories** — Use existing categories when possible to keep filters organized. See [Category Guidelines](../07-reference/category-guidelines.md).

**Slug** — The slug is auto-generated from the title and date (e.g. `260410_casa-marianella`). It becomes the URL and the folder name on GitHub. You can't easily change it later without breaking links.

**Related awards and press** — To show an award or feature on a project's page, link it from the award/news entry using the `relatedProjects` field. See [Adding News & Awards](adding-news-awards.md).

**Draft** — New entries default to published. Toggle the draft dot in the table row to hide an entry while you work on it.

---

## Troubleshooting

**"My project doesn't appear in the index"**
- Check that the draft toggle is grey (published), not red (draft)
- Wait 3–5 minutes for the site to rebuild after saving

**"The wrong image shows up as thumbnail"**
- Make sure you have exactly one file named `header.jpg` or `thumb.jpg`

**"My categories don't appear in filters"**
- Categories update after the next site rebuild (3–5 min after saving)

See [Common Issues](../06-troubleshooting/common-issues.md) for more help.

---

> **Advanced: How it works under the hood**
>
> When you save in the admin panel, it writes a markdown file to `entries/projects/{slug}/{slug}.md` on GitHub with your content in [frontmatter](frontmatter-reference.md) format. The build system (Eleventy) discovers the file automatically and generates the project page and index entry. You can edit these files directly on GitHub if you need to make changes the admin panel doesn't support — see [Frontmatter Reference](frontmatter-reference.md) for the full field list.
