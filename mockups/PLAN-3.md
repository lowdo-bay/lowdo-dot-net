# Plan 3 — Admin panel support for ADU project fields

## Why

Right now an editor adding a new ADU project (or converting an existing project into an ADU) has to hand-edit YAML frontmatter — the admin panel at `/admin/` only knows about the standard project fields (title, description, categories, year, location, status, collaborators, etc.). To make the ADU library a normal-feeling part of the workflow, the admin needs to grow the same data shape that we just added to the projects: a top-level `adu_library: true` flag, and a nested `adu:` block with tier, bedrooms, loft, stair, sqft, budget range, orientation, footprint, height, and features.

This plan lists every place the admin currently handles project fields and what to add/edit at each one.

## What the editor will see

A new section called **"ADU Library"** appears inside the Edit Panel modal, shown only for entries with `type: project`. It contains:

1. A single checkbox at the top: **"This is an ADU library entry"** — wired to the top-level `adu_library` field.
2. When that checkbox is on, a sub-panel of ADU-specific fields appears:
   - **Tier** — dropdown (Essential / Standard / Plus)
   - **Bedrooms** — number input
   - **Loft** — checkbox ("Includes a sleeping loft")
   - **Stair** — dropdown (Ladder / Spiral stair / Straight stair / Switchback stair / Single-story (none))
   - **Square footage** — number input
   - **Build cost — Low** — number input ($)
   - **Build cost — High** — number input ($)
   - **Orientation** — dropdown (Any / North–South / East–West)
   - **Footprint** — text input (e.g. "12×16 ft")
   - **Height** — text input (e.g. "single + loft", "two-story")
   - **Features** — multi-tag input (loft, porch, deck, courtyard, stair, etc.) modeled on the existing Categories tag list

When the editor saves, all of these get serialized into the entry's `.md` file as the same nested `adu:` block we already produce by hand for the three sample projects.

## File-by-file changes

There are three layers to touch: the admin HTML form, the admin JS state and DOM wiring, and the Netlify function that writes the markdown file. There is one optional fourth layer (docs).

### 1. `admin/index.njk` — add the new form section

Add a fifth `.ep-section` inside `.edit-panel__body`, after the existing **Relations** section. Use the existing markup conventions (`.ep-grid`, `.ep-row__label`, `.ep-row__control`, tooltip markup). Mark every row inside this section with class `project-only` and an extra class `adu-only` so we can gate visibility from JS based on both type and the `adu_library` toggle.

New DOM ids needed (one per field):

| Field | Element type | id |
|---|---|---|
| ADU library flag | checkbox | `ep-adu-library` |
| Tier | dropdown (`.admin-dropdown`) | `ep-adu-tier` |
| Bedrooms | number input | `ep-adu-bedrooms` |
| Loft | checkbox | `ep-adu-loft` |
| Stair | dropdown | `ep-adu-stair` |
| Square footage | number input | `ep-adu-sqft` |
| Budget low | number input | `ep-adu-budget-low` |
| Budget high | number input | `ep-adu-budget-high` |
| Orientation | dropdown | `ep-adu-orientation` |
| Footprint | text input | `ep-adu-footprint` |
| Height | text input | `ep-adu-height` |
| Features | tag list + add control | `ep-adu-features-tags`, `ep-adu-features-input` |

Also: add a small **"ADU Library" filter chip** to the toolbar (next to the existing `STATUS` filter) so editors can quickly list just the ADU library entries. Optional but cheap.

Also: extend the embedded `window.__ENTRIES__` script block to include the new fields:

```nunjucks
adu_library: {{ (entry.data.adu_library or false) | dump | safe }},
adu: {{ (entry.data.adu or null) | dump | safe }},
```

### 2. `_includes/assets/js/admin.js` — wire the form to state + change detection

**State / snapshot.** Update the `snapshot()` function (around line 60) to include the two new fields — needed for diffing:

```js
adu_library: e.adu_library,
adu: JSON.stringify(e.adu || null)
```

**DOM refs.** Add new element references for every input id from the table above (around line 150).

**Read-on-open.** When the Edit Panel opens an entry, populate every ADU input from `entry.adu_library` and `entry.adu`. If `entry.adu` is null, all sub-fields stay empty. The `adu-only` rows are hidden when `adu_library` is unchecked (same pattern as the existing `.ep-featured-position-row` show/hide).

**Visibility gating.** Two scopes work together:
- `project-only` — already exists; toggled by entry type
- `adu-only` — new; toggled by the `ep-adu-library` checkbox state. Even on a project, the spec sub-fields stay hidden until the editor flips the ADU flag on.

A small helper, `updateAduVisibility()`, gets called whenever the type changes or the ADU flag changes.

**Write-on-apply.** When the editor clicks "Apply Changes," collect the new values and store them on the entry record. The diffing logic in `recordChange()` (around line 590, where it compares `snapshot(entry)` to the original) will pick them up automatically once they're on the snapshot.

Two write paths:
- `e.adu_library = epAduLibraryCheckbox.checked` (boolean)
- `e.adu = collectAduFields()` — a function that returns a plain object with all 11 nested fields, or `null` if `adu_library` is false

**Features tag editor.** Reuse the existing tag-list pattern from Categories (around line 1896, `// ---- Panel category editor ----`). The features list is a small, fixed vocabulary, so present it as a multi-select dropdown of known options (loft, porch, deck, courtyard, stair, accessible) instead of a free-text input. Editors can still pick zero or more.

**Tier / Stair / Orientation dropdowns.** Reuse the existing `.admin-dropdown` component (used for Type and Status). Each dropdown gets a fixed list of options.

### 3. `netlify/functions/update-entries.mjs` — persist the new fields

Two functions need updates: `applyChangesToFile` (around line 83) and `buildNewEntryContent` (around line 120).

**In `applyChangesToFile`:**
```js
if (change.adu_library !== undefined) {
  if (change.adu_library === true) {
    d.adu_library = true;
  } else {
    delete d.adu_library;   // remove the flag entirely when unchecked
    delete d.adu;            // also clean up the nested block
  }
}
if (change.adu !== undefined) {
  if (change.adu && Object.keys(change.adu).length) {
    d.adu = change.adu;
  } else {
    delete d.adu;
  }
}
```

**In `buildNewEntryContent`:**
```js
if (change.adu_library) d.adu_library = true;
if (change.adu) d.adu = change.adu;
```

The existing `gray-matter` serializer handles nested objects fine — it'll write the `adu:` block as multi-line YAML automatically.

### 4. (Optional) `docs/02-adding-content/adding-a-project.md`

If you want the new fields documented for non-technical editors, add a short "ADU Library" subsection that explains:
- What the "This is an ADU library entry" checkbox does
- Where the project will and won't appear (yes: `/adu-library/` and `/project/{slug}/`; no: `/all/`)
- A one-line description of each spec field

This is non-blocking — the admin panel tooltips can carry the same information inline.

## Behavioral details worth nailing down before implementation

A few small choices that I'll otherwise default to as listed:

1. **What happens when the editor unchecks "This is an ADU library entry" on an entry that previously had specs?** Default: the `adu_library` flag is removed AND the nested `adu` block is removed. The editor sees a confirmation toast: "ADU specifications will be removed from this entry — save to confirm." If they want to preserve the data, they leave the box checked.

2. **Validation.** Default behavior: the form does NOT enforce required fields on the ADU sub-panel (an editor can save a partial spec). The library page already handles missing fields gracefully (cells show empty strings). If you want stricter validation (e.g. require tier and bedrooms), say so.

3. **Tier change → category management.** Right now, the three sample ADUs include `ADU` as a `category`. We could either (a) auto-add the `ADU` category when the ADU flag is checked, or (b) leave categories independent. Default: leave them independent — categories are about labeling, the ADU flag is about routing. Editors who want `ADU` shown in category chips add it manually.

4. **New ADU button.** The toolbar's "+ New Entry" button currently creates a generic entry. We could add a separate "+ New ADU" button that pre-fills `type: project, adu_library: true`. Default: no — editors use "+ New Entry," set type to project, then check the ADU flag. One less button to maintain. (Easy to add later if you want it.)

## Acceptance check after implementation

After this plan is implemented, an editor should be able to:

1. Log into `/admin/`
2. Click "+ New Entry"
3. Set type to `project`, type a title
4. Check **"This is an ADU library entry"**
5. Fill in tier, bedrooms, loft, stair, sqft, budget range, orientation, footprint, height, features
6. Click Apply, then Save Changes
7. After Netlify rebuild: the new entry shows up at `/adu-library/` and at `/project/{slug}/`, with the Specifications panel rendered correctly. It does NOT show up at `/all/`.
8. Reopen the entry in the admin → all ADU fields are populated from the saved frontmatter. Editing and saving again preserves them.
9. Uncheck the ADU flag → save → entry no longer appears at `/adu-library/`, appears at `/all/`, and the Specifications panel is gone from the project page.

## File summary

```
admin/index.njk                                ← edit (add ADU section + extend embedded entries data)
_includes/assets/js/admin.js                   ← edit (state, DOM refs, read/write, visibility gating, dropdowns + tag editor)
netlify/functions/update-entries.mjs           ← edit (applyChangesToFile + buildNewEntryContent)
docs/02-adding-content/adding-a-project.md     ← edit, OPTIONAL (documentation)
```

Total: 3 required file edits, 1 optional. No new files.

---

**Reply with approval or any changes. If you want a different default for any of the four "behavioral details" above, say so before I start.**
