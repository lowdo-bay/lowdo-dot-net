# Editing Existing Entries

All content edits are done through the Admin Panel at `/admin/`.

---

## How to Edit an Entry

1. Go to `/admin/` and log in
2. Find the entry in the table — use the search box or type filters to narrow it down
3. Click **Edit** on the row
4. Make your changes in the side panel
5. Click **Apply Changes**
6. Click **Save Changes** (top right) to commit everything to GitHub

The site rebuilds automatically in 3–5 minutes.

---

## What You Can Edit

**In the side panel:**
- Title, subtitle, description
- Date (affects sort order)
- Link (external URL)
- Categories (also editable inline in the table row)
- Type (also editable inline)
- Draft status (also togglable via the dot in the table row)
- Body text (project description, written in markdown)
- Collaborators (projects only)
- Related projects (non-projects only)

**Not editable in the admin panel:**
- The entry slug (URL path) — contact Bay or ask an AI assistant if you need to rename an entry
- Images — upload/replace images directly on [GitHub](https://github.com/lowdo-bay/lowdo-dot-net) in the entry's folder

---

## Editing Categories Inline

You don't need to open the edit panel to change categories:

- Click **×** on a tag in the table row to remove it
- Click **+** to add a category (opens a searchable dropdown)
- Type a new name to create one that doesn't exist yet

---

## Saving

All changes are held in memory until you click **Save Changes**. The counter in the top-right shows how many entries have pending changes. Changes are committed to GitHub in a single operation — you can edit multiple entries before saving.

⚠️ If you leave the tab or the session expires (24 hours), unsaved changes are lost.

---

## Next Steps

- [Hiding/Unpublishing Content](hiding-unpublishing.md) — Make an entry invisible without deleting it
- [Organizing Entries](organizing-entries.md) — Sort order and categories
