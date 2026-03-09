# Plan: Fix Grid Lines Not Rendering Above Header Image

## Context

The vertical grid lines (`body::after`, z-index: 9999) and the header bottom border (`.project-header::after`, z-index: 9999) are not rendering above the header image (`.project-header .header-image`, z-index: 1). The stacking math looks correct on paper, but in practice the image covers the lines.

## Root Cause

`.project-header .grid__item--span-2-left` has `position: relative` (required as containing block for the absolutely-positioned `.header-image`). It has **no z-index**, so it does not create a stacking context.

`.project-header .header-image` has `position: absolute; z-index: 1` — this DOES create a stacking context, and it participates in the **root** stacking context (z-index 1), since none of its ancestors create a stacking context.

`body::after` (vertical lines) and `.project-header::after` (horizontal bottom border) are also in the **root** stacking context at z-index: 9999.

The math says 9999 > 1 so the lines should win — but they don't. The reason is **paint order within the root stacking context when a grid container is involved**. `body` is `display: grid` (class `grid grid--body`). Grid items (`header`, `main`, `footer`) participate in `body`'s stacking context. `body::after` (z-index: 9999) is also in `body`'s stacking context. However, **content painted inside grid items that themselves establish stacking contexts can visually appear above `body::after`** due to how compositing layers are assembled — especially in browsers that promote high-z-index stacking contexts to GPU layers.

The reliable fix is to **give `.project-header` an explicit `z-index`**, making it form its own stacking context. This isolates its contents (image at z-1, grid lines at z-9999) so they are compared against each other **within** `.project-header`'s stacking context. Then `.project-header` as a whole participates in the root stacking context at its given z-index — below `body::after`'s 9999.

## Solution

Add `z-index: 1` to `.project-header` in the scoped style block of `project.njk`. This:
1. Creates a stacking context for the header section
2. Inside that context: image (z-index: 1) is below the header's own pseudo-element grid lines (z-index: 9999)
3. `body::after` (vertical lines, z-index: 9999 in root context) still renders above `.project-header` (z-index: 1 in root context)

**File: `_includes/layouts/project.njk`**

```css
/* Before */
.project-header {
  padding-bottom: 0;
  padding-top: var(--space-3);
}

/* After */
.project-header {
  padding-bottom: 0;
  padding-top: var(--space-3);
  z-index: 1;
}
```

Note: `.project-header` already has `position: relative` from `base.css` (line 678), so adding `z-index: 1` is valid and sufficient to create a stacking context.

## Critical Files

- `_includes/layouts/project.njk` — `.project-header` rule (~line 302)

## Verification

1. Open http://localhost:8080/project/wolf-creek-ranch/
2. The dashed vertical column lines (from `body::after`) should be visible over the header image
3. The solid horizontal bottom border of the header section should be visible over the image
4. Image sizing should be unchanged
