# Using the Admin Panel

The admin panel at `/admin/` is a password-protected interface for managing all site entries — editing fields, publishing/unpublishing, adding new entries, deleting entries, and renaming categories and types.

All changes are batched and committed to GitHub in a single operation when you click **Save Changes**, triggering an automatic deploy.

---

## Logging In

1. Go to `/admin/` (e.g. `https://lowdo.netlify.app/admin/`)
2. Enter the admin password
3. Click **Log In**

Contact Bay if you need the password.

---

## The Table View

After logging in you'll see a table of all entries (including drafts). Columns:

| Column | Description |
|--------|-------------|
| ☐ | Checkbox for bulk selection |
| Draft | Red dot = draft (hidden), grey = published |
| Slug | The entry's URL identifier |
| Title | Entry title |
| Categories | Inline-editable tags |
| Type | Entry type tag (inline-editable) |
| Date | Entry date |
| Actions | Edit / Delete buttons |

### Filtering and Searching

- **Search box** — filter by title or slug as you type
- **Type filter chips** — show only entries of a specific type
- **Column headers** — click to sort ascending/descending

---

## Editing an Entry

Click **Edit** on any row to open the side panel with all editable fields:

| Field | Notes |
|-------|-------|
| Title | Main heading |
| Subtitle | Short tagline shown below title |
| Description | Summary shown in the index |
| Date | Publication / event date |
| Link | External URL (makes title clickable) |
| Position | Sort order override (lower = first) |
| Body Text | Markdown content below frontmatter |
| **Projects only:** | |
| Year | Display year instead of full date |
| Location | Geographic location |
| Status | Built / In Progress / Proposed |
| Featured | Show on homepage featured section |
| Featured Position | Order within featured section |
| Collaborators | Name + role pairs |
| **Non-projects only:** | |
| Related Projects | Link to project pages (slug autocomplete) |

Click **Apply Changes** to confirm edits. The row highlights yellow to indicate unsaved changes. Click **Save Changes** (top right) to commit everything to GitHub.

---

## Draft Toggle

The dot in the **Draft** column controls visibility:

- **Red dot** = draft (hidden from public site)
- **Grey dot** = published (visible on public site)

Click the dot to toggle. Draft entries are visible in the admin table but excluded from the public index and project pages.

---

## Editing Categories Inline

Each entry's categories appear as tags in the table row:

- Click **×** on a tag to remove it
- Click **+** to add a category (opens a searchable dropdown)
- Type a new name in the dropdown to create a category that doesn't exist yet

---

## Editing Type Inline

The type tag works the same way:

- Click **×** or **+** on the type tag to open the type picker
- Start typing to filter existing types or create a new one
- Press Enter or click **+ Create "..."** to set a custom type

---

## Adding a New Entry

1. Click **+ New Entry** (top right)
2. A new blank row appears in the table, marked with a blue highlight
3. Click **Edit** on the new row to open the side panel
4. Fill in the title, type, date, and any other fields
5. Click **Apply Changes**
6. The slug is auto-generated from the title and today's date (e.g. `260410_my-entry`)
7. Click **Save Changes** to create the file on GitHub

**Default:** New entries are created as `type: project` in `entries/projects/`. Change the type tag in the row to use a different type — non-project entries are placed in `entries/other/` automatically.

---

## Deleting an Entry

1. Click **Del** on the row you want to remove
2. Confirm the deletion in the dialog
3. The row is marked for deletion (removed from the table immediately)
4. Click **Save Changes** to permanently delete the folder and files from GitHub

⚠️ Deletion cannot be undone after saving.

---

## Bulk Category Editing

Select multiple entries using the checkboxes, then use the bulk action buttons that appear:

- **+ Add Category** — add a category to all selected entries at once
- **− Remove Category** — remove a category from all selected entries

---

## Renaming Labels (Categories and Types)

To rename a category or type across all entries at once:

1. Click **Manage Labels** in the toolbar
2. Select the **Categories** or **Types** tab
3. Click **Rename** next to the label you want to change
4. Type the new name and press Enter or click **Save**
5. All entries with that label are updated in memory
6. Click **Save Changes** to commit everything to GitHub

This is faster than selecting entries individually and editing them one by one.

---

## Saving Changes

All edits are held in memory until you click **Save Changes**. The counter in the header shows how many entries have pending changes.

When you save:
1. All changes are sent to the GitHub API as a single commit
2. Netlify detects the commit and deploys automatically (3–5 minutes)
3. The table resets — modified highlights clear

**If the session expires** (24 hours): you'll be prompted to log in again. Any unsaved changes in memory will be lost — save before leaving the tab for a long time.
