# ADU Library — Mockup Plan

A new "product" page for free, downloadable ADU design packets. The mockups below explore **five viable user-journey concepts**, each as a high-fidelity interactive prototype, all reusing the existing LowDO design system (CSS variables, dashed/solid grid lines, accent palette, spreadsheet aesthetic).

---

## 1. Goals

1. Present a growing library of ADU designs (potentially dozens) without the page feeling like a generic store.
2. Help a non-architect customer narrow down to the right design based on **budget, layout, # bedrooms, lot orientation, stair type, etc.**
3. Make the deliverables (PDF drawings, 3D model, materials/cost spec, permit docs) feel substantive and trustworthy — these are professional documents, not stock plans.
4. Stay within LowDO's visual DNA: minimal, spreadsheet-grid, generous whitespace, dashed/solid borders, accent color progression.

## 2. Shared content model (the same for every mockup)

Each ADU design is an "entry" with this data, so all five mockups consume the same JSON-like dataset and stay swappable:

```
{
  id: "ADU-001",
  name: "Loft Cabin",                  // friendly name
  tier: "Essential",                   // Essential / Standard / Plus
  bedrooms: 1,
  loft: true,
  stair: "ladder",                     // ladder / spiral / straight / switchback
  sqft: 380,
  budget_low: 65000,
  budget_high: 95000,
  orientation: "any",                  // any / north-south / east-west
  footprint: "12x16",                  // ft x ft
  height: "single + loft",
  features: ["loft", "porch"],
  thumbnail: "/img/adu-001-iso.png",
  floorplan: "/img/adu-001-plan.svg",
  deliverables: ["pdf-drawings","3d-model","spec-sheet","permit-docs"]
}
```

A small mock dataset (~8–10 designs) will live in a single shared `data.js` so all five mockups read the same source of truth — easy to swap in real data later.

## 3. CSS / pattern reuse from the existing site

Every mockup will pull from the existing visual system. Specifically:

- CSS custom properties from `theme.njk`: `--color-accent-1` through `--color-accent-5`, `--color-text`, `--color-background`, `--grid-line-color`, `--space-1`…`--space-9`, `--font`, `--font-size-base`, `--font-size-small`.
- **Grid system from `base.css`: the standard 4-equal-columns grid (`repeat(4, 1fr)`) used by `.grid--header`, `.grid--intro`, `.grid--project`, `.grid--description`** — not `.grid--index`. All mockups use this grid plus the `.col-1` through `.col-1-2-3-4` spans (and the `--padded` variants) so cells line up cleanly with the dashed vertical column lines.
- Spreadsheet borders: solid major horizontal lines + dashed minor lines + dashed verticals at column edges (the `body::after` pattern).
- Hover-row pattern adapted from `.index-row:hover` (full-bleed accent-5 tint + scaleX-animated highlight on the row title), but rebuilt to sit inside the standard 4-col grid rather than the index's 4fr/4fr/7fr/1fr.
- Download gate UX from `project.njk` (email + checkbox before download triggers).
- Light/dark mode via `:root[dark]` (each mockup will include the dark-mode toggle in the header).

The mockups will not modify any production CSS. They will live in `/mockups/` and inline a curated copy of the relevant CSS so they're self-contained and won't break if the site changes.

## 4. The five concepts

Each is a separate standalone HTML page so you can open them side-by-side and compare.

### Mockup A — "Configurator Wizard"
**File:** `/mockups/a-configurator.html`

A multi-step quiz that funnels the customer to a recommended design.
- **Step 1:** Budget range (slider, $50k–$250k).
- **Step 2:** Bedrooms (1, 2, 1+loft).
- **Step 3:** Lot orientation (radio: any / N-S / E-W) + lot size constraint.
- **Step 4:** Preferences (toggles: real stair vs. ladder, porch, deck, accessible).
- **Result page:** A ranked list of 3 best matches + a short paragraph explaining *why* this one matches their inputs ("Your $90k budget and 1-bedroom preference mean…"). Each result expands inline to show drawings, materials list, deliverables download.

The form interactions feel native to LowDO's spreadsheet aesthetic — checkboxes are square, sliders are line-only, text uppercase with letter-spacing.

### Mockup B — "Filterable Catalog"
**File:** `/mockups/b-catalog.html`

All designs as rows in a long spreadsheet-style table built on the standard 4-equal-columns grid. Each row uses the four columns as: **col 1 = isometric thumbnail, col 2 = name + tier, col 3 = key specs (bed/sqft/stair), col 4 = price + download action**. Sticky filter bar at top (checkboxes for # bedrooms, stair type, budget range buckets, features) — same `index-filters` styling. Live filtering with no page reload.

Each row is expandable: clicking opens an in-line drawer (same animation as the staff entry expand) with floor plan, cost breakdown, and download gate. The full-bleed accent-5 hover tint + scaleX title highlight from the index gets adapted to fit this 4-equal-cols layout.

This is the most "on-brand" option — minimal new vocabulary.

### Mockup C — "Compare Tray"
**File:** `/mockups/c-compare.html`

Catalog browsing (similar to Mockup B's filter feel, also on the 4-equal-cols grid) plus a **persistent fixed-bottom tray** where the user adds up to 3 designs by clicking a "+ compare" cell on each row. When they click "Compare", the page transitions to a side-by-side spec table where each design occupies one column of the 4-col grid (so 3 designs fit naturally with col 1 reserved for the attribute label). Each row of the comparison shows one attribute (cost, sqft, bedrooms, stair, deliverables) with the cells of the "winning" value highlighted (smallest cost, biggest sqft, etc.).

Plays directly into the spreadsheet aesthetic — the comparison view literally is a spreadsheet. Borrows the dashed/solid line treatment from the existing `project-collab-grid` styling.

### Mockup D — "Tiered Showcase / Editions"
**File:** `/mockups/d-tiers.html`

A pricing-page-style layout with three horizontal tiers stacked vertically:
- **Essential** (smallest, cheapest, ladder stair) — 2–3 designs in this tier
- **Standard** (1 br + porch, real stair) — 2–3 designs
- **Plus** (2 br, full kitchen, deck) — 2–3 designs

Each tier has its own header band with a thick solid line above and dashed line below, a tagline, a "starts at $X" price, and 2–3 designs as cards underneath. Story-driven: less filtering, more guided narrative. Still includes a tiny "browse all designs →" link to the catalog view at the bottom for power users.

Best for first-time visitors who want to be told "here are your three real options" rather than browse 30 rows.

### Mockup E — "Spectrum Canvas"
**File:** `/mockups/e-spectrum.html`

The most experimental and arguably the most on-brand for a studio that prizes "making the invisible visible". A 2D plot:
- **X-axis:** budget (low → high)
- **Y-axis:** complexity / size (simple loft cabin → 2br with full stair)

Each design is a labeled dot on the plot. Hover any dot to see a small floating preview card (uses the existing `photo-tooltip` styling). Click to expand a side panel with full info + downloads. Filter chips above the canvas can hide/show families of designs. Optional toggle to redraw the axes (e.g., switch X to "sqft" or Y to "# bedrooms").

This treats the whole catalog as a single legible diagram — very studio-like.

## 5. Shared elements across all mockups

To keep the mockups grounded as part of the same site, every page includes:

- The same simplified `header.p--content` (LowDO wordmark + hamburger menu, sticky).
- The same `body::after` dashed vertical grid lines.
- The same dark-mode toggle behavior (`:root[dark]`).
- The same `footer.p--content` style.
- The download-gate drawer pattern (email + checkbox) wired up to a fake "download" action that opens an alert.
- A common "tagged thumbnail" component for an ADU design — small isometric drawing, name, sqft, budget — so each mockup's design cells look like the same product.

## 6. Deliverables (what you get)

```
mockups/
├── PLAN.md                  ← this file
├── data.js                  ← shared mock dataset (~8–10 ADU designs)
├── shared.css               ← curated copy of the LowDO styles each mockup needs
├── shared.js                ← dark-mode toggle + download-gate logic (shared)
├── a-configurator.html
├── b-catalog.html
├── c-compare.html
├── d-tiers.html
├── e-spectrum.html
└── index.html               ← simple landing page linking to all five mockups for review
```

You'll be able to open `mockups/index.html` and click into each. They're standalone, no build step needed — just `open` the file in a browser.

## 7. Open questions / assumptions I'm making

A few things I'll assume unless you tell me otherwise:

- **Pricing data is the *customer's* estimated build cost**, not what LowDO charges. The product itself is free.
- **No real ADU drawings / images yet** — I'll generate clean SVG isometric placeholders and SVG floor plans in the LowDO accent colors so the mockups feel real but don't require asset prep from you.
- **Mockups don't need to be production code** — they're for evaluation. Once you pick a direction, I'd rebuild it as a proper Eleventy template.
- **Mobile responsive but desktop-first** — same breakpoints as the site (540, 840, 1140).
- **Accessibility:** semantic HTML, keyboard navigation for the configurator/canvas, reduced-motion respect — but not a full WCAG audit at the mockup stage.

---

## What happens after you approve

If this looks right, I'll build the five HTML files plus shared assets (estimated ~1500–2500 lines of HTML/CSS/JS total across all five). After you've reviewed them, you tell me which direction(s) feel right and I'll outline how to convert the winner into a real Eleventy template under `/projects/adu-library/` or wherever it lands in the IA.

**If anything in this plan should be changed, removed, or added, tell me before I start building.**
