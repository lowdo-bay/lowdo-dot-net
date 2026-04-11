# Organizing Entries

Managing categories, dates, and sort order.

---

## Sort Order

Entries are sorted by:

1. `position` field (if set, lower = first)
2. `date` field (newest first)

---

## Using position

Override date sorting:

```yaml
position: 1  # Appears first
```

---

## Categories

Use existing categories when possible. Common categories include:

```yaml
categories:
  - HOUSING        # Residential projects
  - COMMERCIAL     # Commercial/hospitality
  - COMMUNITY      # Civic projects (schools, hospitals, public)
  - SUSTAINABLE    # Sustainability-focused
  - AFRICA         # Work on African continent
  - BAMBOT         # Bamboo robotic construction
  - INSTALLATION   # Temporary structures, exhibitions
  - AMP            # Agbogbloshie Makerspace Platform
```

See [Category Guidelines](../07-reference/category-guidelines.md) for the complete list.

### Renaming or Reorganizing Categories

The easiest way to rename or consolidate categories is through the **admin panel**:

1. Go to `/admin/` and log in
2. Click **Manage Labels** in the toolbar
3. Under the **Categories** tab, click **Rename** next to any category
4. Type the new name and press Enter or click Save
5. All entries with that category are updated automatically
6. Click **Save Changes** to commit everything to GitHub

See [Using the Admin Panel](../08-admin/using-the-admin.md) for full details.

---

## Dates

Format: YYYY-MM-DD

Changes sort order and display.

---

## Next Steps

- [Category Guidelines](../07-reference/category-guidelines.md)
- [Editing Existing Entries](editing-existing-entries.md)

