# Entry Types Comparison

Quick reference for all entry types.

---

## Entry Types Table

| Type | Folder | Gets Page? | Use For |
|------|--------|-----------|---------|
| `project` | `entries/projects/` | ✅ Yes | Design and architecture work |
| `news` | `entries/other/` | ❌ Index only | Studio announcements |
| `award` | `entries/other/` | ❌ Index only | Honors and recognitions |
| `feature` | `entries/other/` | ❌ Index only | Press coverage |
| `lecture` | `entries/other/` | ❌ Index only | Talks and presentations |
| `exhibition` | `entries/other/` | ❌ Index only | Gallery shows |
| `staff` | `entries/other/` | ❌ Index only | Team updates |

The `type:` value is set in each entry's frontmatter. You can also create custom types — they'll appear as filter options in the index automatically.

---

## Key Differences

**Projects:**
- Live in `entries/projects/`
- Get individual pages at `/project/{slug}/`
- Have image galleries (all images in folder auto-discovered)
- Include collaborators field
- More detailed content

**Updates (everything else):**
- Live in `entries/other/`
- Index only — no individual pages
- Single thumbnail
- Can link externally via `link:` field
- Brief descriptions

---

## Changing an Entry's Type

From the **admin panel** (`/admin/`): click the type tag on any row to open a dropdown and select or type a new type. Changes are committed on Save.

- Changing between non-project types (e.g. `award → feature`): frontmatter update only, no file move
- Changing to/from `project`: requires moving the file between `entries/projects/` and `entries/other/`

---

## Next Steps

- [Adding a Project](../02-adding-content/adding-a-project.md)
- [Adding News/Awards](../02-adding-content/adding-news-awards.md)
- [Using the Admin Panel](../08-admin/using-the-admin.md)
