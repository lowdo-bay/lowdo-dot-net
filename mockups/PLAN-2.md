# Plan 2 — ADU projects + working library page

## What's changing in one paragraph

ADU schemes become real project entries that live in `entries/projects/` alongside the studio's regular work. They use the existing `type: project` system with a few new ADU-specific frontmatter fields. They're filtered OUT of the comprehensive index at `/all/` and only appear inside a new working library page at `/adu-library/`. The library page is a fresh `.njk` template based on Mockup B (Catalog) but reading the real Eleventy collection. Each row links to the standard `/project/{slug}/` page; downloads happen there using the existing email-gated Design Toolkit section. The five static mockups in `/mockups/` are not touched — they stay as concept references.

---

## 1. Frontmatter shape

ADU projects use the same `.md` shape as other projects, plus new fields. Two new bits:

**A new top-level marker** so collection filters can include/exclude ADUs:
```yaml
adu_library: true
```

**A nested `adu` block** with the spec fields (mirrors what's in `data.js` today):
```yaml
adu:
  tier: Essential        # Essential | Standard | Plus
  bedrooms: 1            # 1 | 2
  loft: true             # true | false
  stair: ladder          # ladder | spiral | straight | switchback | none
  sqft: 380
  budget_low: 65000
  budget_high: 95000
  orientation: any       # any | north-south | east-west
  footprint: "12×16 ft"
  height: "single + loft"
  features:
    - loft
    - porch
```

Standard project fields (`title`, `subtitle`, `description`, `date`, `year`, `categories`, `collaborators`, `location`, `status`, `headerImage`, `images`, `drawings`, `toolkitFiles`) work exactly as today. ADU `categories` will probably include things like `HOUSING`, `ADU` so they read coherently in the project header.

Migration of the data: the 10 ADUs currently in `data.js` get translated into 10 stub project entries. They'll have placeholder `summary` text from the dataset and no real images yet — that's fine, the existing project layout handles missing images gracefully (the header image just doesn't render).

## 2. Collection filtering (Eleventy)

In `.eleventy.js` (or wherever the `entries` collection is currently defined), two changes:

**Add a new `aduLibrary` collection:**
```js
config.addCollection("aduLibrary", (api) =>
  api.getFilteredByGlob("entries/projects/**/*.md")
     .filter(p => p.data.adu_library === true && p.data.draft !== true)
     .sort((a, b) => {
       const tierOrder = { Essential: 1, Standard: 2, Plus: 3 };
       const t = (tierOrder[a.data.adu?.tier] || 99) - (tierOrder[b.data.adu?.tier] || 99);
       if (t !== 0) return t;
       return (a.data.adu?.sqft || 0) - (b.data.adu?.sqft || 0);
     })
);
```

**Modify the existing `entries` collection** (the one feeding `/all/`) to filter out ADU library entries:
```js
.filter(e => e.data.adu_library !== true)
```

Result: `/all/` no longer shows ADU schemes; `/adu-library/` shows only ADU schemes; individual project pages at `/project/{slug}/` still publish for both kinds.

## 3. Specifications panel in `project.njk`

A new section is added to the existing project layout, shown only when `adu` frontmatter is present. Visually it matches the existing collaborator / awards tables (cell-based, dashed-line spreadsheet aesthetic).

Position: between the project header (Section 1) and the existing Collaborators / Description section (Section 2). So the order on an ADU project page becomes:

1. Project header (image left, title/tagline/categories right)
2. **Specifications panel** ← new
3. Collaborators (left) + Description (right)
4. Photos
5. Drawings
6. Design Toolkit (with the email-gated downloads — already exists)
7. Related Projects

The Specifications panel renders as a 4-column grid table with these rows:

| Tier | Essential / Standard / Plus |
| Bedrooms | 1 + LOFT |
| Square footage | 380 sqft |
| Footprint | 12×16 ft |
| Height | single + loft |
| Stair | Ladder |
| Orientation | Any lot |
| Features | LOFT, PORCH |
| Build cost (est.) | $65K–$95K |

Implementation: extends the existing `.project-collab-grid` styling pattern from `_includes/layouts/project.njk` (same dashed lines, same uppercase typography, same major/minor border treatment). No new CSS pattern needed — just a new section using existing primitives.

For non-ADU projects (regular built work), this section is skipped entirely via a Nunjucks `{% if adu %}…{% endif %}` guard. No visual change to existing project pages.

## 4. The new working library page

Created at `entries/adu-library.njk` (or a similar location that matches the site's existing template conventions) with permalink `/adu-library/`.

Structure mirrors Mockup B (Catalog), but as a real Eleventy template:

- Uses the actual production CSS — `_includes/assets/css/base.css` and `_includes/assets/css/theme.njk` — not the `/mockups/` curated copy.
- Includes `_includes/layouts/base.njk` so it inherits the site's real header, footer, dark mode, and font setup.
- Page title and description in a `page-intro` section (same as Mockup B).
- Sticky filter bar with 4 columns (Bedrooms · Stair · Budget · Features). Filter values are computed at build time from the actual `aduLibrary` collection — so if a tier or feature isn't represented in the data, its checkbox doesn't render.
- Each row is a `<a href="/project/{slug}/">` element. No inline downloads, no expand-on-click. Clicking goes straight to the project page.
- Row layout: column 1 = thumbnail (the project's `headerImage` if present, falling back to a placeholder block), column 2 = name + tier pill + ID, column 3 = specs (sqft, beds, stair, footprint), column 4 = build cost range + a small "VIEW PROJECT →" affordance.
- Live filtering is client-side: the same JavaScript pattern from Mockup B (filter checkboxes mutate row visibility) runs against the rendered DOM.

What's removed compared to Mockup B:
- The expandable row drawer (no inline floor plan + downloads)
- The `js-gate-container` and email gate UI
- The procedural SVG isometric (the row shows the project's actual `headerImage`)
- The "DOWNLOAD ALL" button

## 5. Sample ADU entries

I'll create 3 starter entries to validate the system end-to-end (one per tier), translated from `data.js`:

```
entries/projects/adu-loft-cabin/
  adu-loft-cabin.md      # tier: Essential, bedrooms: 1 + loft
entries/projects/adu-switchback/
  adu-switchback.md      # tier: Standard, bedrooms: 1 + loft + stair
entries/projects/adu-courtyard/
  adu-courtyard.md       # tier: Plus, bedrooms: 2
```

No image files yet — the existing project layout handles missing images. You (or I, in a follow-up) can drop real `header.jpg` / `drawings/*.png` / `toolkit/*.pdf` files into each folder later.

## 6. The five mockups stay frozen

The `/mockups/` folder is unchanged. `data.js` keeps its 10 entries. The five static mockups continue to work as before — they're concept references, not living code. Mockup B is the only one that gets a real-data sibling at `/adu-library/`.

If you later decide to swap directions (e.g. tier showcase or spectrum canvas), we'd convert that mockup to `.njk` the same way — the underlying `aduLibrary` collection and `adu` frontmatter shape stay the same.

## 7. What's intentionally out of scope for this plan

- **Header navigation:** I'm not adding "ADU LIBRARY" to the header menu yet. Once the page is live and tested, you can wire it into the nav drawer (one line in `header.njk`).
- **Custom iso drawings:** The library uses each entry's existing `headerImage`. Adding a dedicated iso field (like `isoImage:` in frontmatter, used as the thumbnail when present) is a small extension we can do once you've decided whether you want hand-drawn iso art or photographic header crops.
- **Real image / drawing / toolkit assets:** I'll create the `.md` files; you drop in real files when ready.
- **The other 4 mockup directions:** Not converted to live templates. They remain in `/mockups/`.

## 8. File-by-file summary

```
.eleventy.js                                ← edit (add aduLibrary collection, filter entries)
_includes/layouts/project.njk               ← edit (add Specifications section)
entries/adu-library.njk                     ← new (working library page)
entries/projects/adu-loft-cabin/
  adu-loft-cabin.md                         ← new (sample ADU entry, Essential)
entries/projects/adu-switchback/
  adu-switchback.md                         ← new (sample ADU entry, Standard)
entries/projects/adu-courtyard/
  adu-courtyard.md                          ← new (sample ADU entry, Plus)
mockups/...                                 ← UNTOUCHED
```

Roughly 5 new files, 2 edited files. Total diff is modest — most of the work is the new library page template.

## 9. Quick acceptance check after implementation

After I'm done, you should be able to:
- Run `npm run serve`
- Visit `/all/` and confirm no ADU schemes appear in the index
- Visit `/adu-library/` and see the 3 sample entries with their tiers and specs
- Click any row → go to `/project/{slug}/` → see the new Specifications section, plus the standard project page (with empty Photos/Drawings sections since there are no images yet)
- Visit one of the existing real projects → confirm no Specifications section appears (since it has no `adu` frontmatter)
- Filter by bedrooms/stair/budget on the library page and watch rows show/hide live

If any of the above doesn't work, that's where I owe you fixes.

---

**Ready to implement on your approval. If anything in this plan should change, point it out before I start.**
