# CSS Spacing System Audit

**Date**: 2026-02-06
**Goal**: Document all margin/padding declarations to prepare for a unified spacing scale refactor.
**Constraint**: Avoid visual regressions; maintain existing layouts.

---

## Summary

The codebase uses a **CSS variable-based spacing system** with a single base unit:
- `--space` = `calc(var(--space-scale) / 100 * 1rem)` (mobile) or `1.5rem` (desktop ≥840px)
- `--content-margin` = `calc(var(--space) * 2)` (outer padding for sections)

**Current approach:**
- Most spacing uses multipliers of `--space` (0.25×, 0.5×, 1×, 1.5×, 2×, 3×, 4×, 6×, 8×)
- Utility classes exist for padding-bottom (`.pb--0` through `.pb--8`) and margin-bottom (`.mb--0` through `.mb--8`)
- A few hardcoded values remain (`0.5rem`, `1rem`, `2rem`, `18px`, `14px`)

**Repeated values:**
- `calc(var(--space) * 0.5)` — used 20+ times (half-space, common for internal padding)
- `calc(var(--space) * 2)` — used 5+ times (double-space, section spacing)
- `var(--space)` — used 10+ times (base unit)

---

## Existing Spacing Variables

### Base Variables (defined in theme.njk and base.css)
```css
:root {
  --space-scale: 100;  /* User-configurable via CMS */
  --space: calc(var(--space-scale) / 100 * 1rem);  /* Mobile: ~1rem */
  --content-margin: calc(var(--space) * 2);        /* Outer section padding */
}

@media (min-width: 840px) {
  :root {
    --space: calc(var(--space-scale) / 100 * 1.5rem);  /* Desktop: ~1.5rem */
  }
}
```

---

## All Margin Declarations

### Resets
| Location | Declaration | Purpose |
|----------|-------------|---------|
| `base.css:24` | `margin: 0` | Universal reset on all elements |

### Structural Margins
| Location | Declaration | Value/Formula | Context |
|----------|-------------|---------------|---------|
| `base.css:83` | `margin-left: calc(-50vw + 50%)` | Breakout | `.grid__item--breakout` (full-width) |
| `base.css:84` | `margin-right: calc(-50vw + 50%)` | Breakout | `.grid__item--breakout` (full-width) |
| `base.css:186` | `margin-left: calc(-50vw + 50%)` | Breakout | `.header-menu__dropdown` (mobile full-width) |
| `base.css:182` | `margin-top: calc(var(--space) * 0.5)` | **0.5× space** | `.header-menu__dropdown` |
| `base.css:296` | `margin-bottom: var(--space)` | **1× space** | `p` (paragraph) |
| `base.css:300` | `margin-bottom: 0` | Reset | `header .markdown *` |
| `base.css:555` | `margin: 0` | Reset | `.grid--header`, `.grid--footer`, etc. |
| `base.css:642` | `margin-left: calc(-50vw + 50%)` | Breakout | `.banner-image` |
| `base.css:669` | `margin-top: calc(-1 * var(--content-margin))` | **-2× space** | `.project-header .grid__item--span-2-left` (negative pullback) |
| `base.css:670` | `margin-bottom: calc(-1 * var(--content-margin))` | **-2× space** | `.project-header .grid__item--span-2-left` |
| `base.css:677` | `margin-bottom: calc(var(--space) * 2)` | **2× space** | `.project-header` |
| `base.css:769` | `margin-bottom: calc(var(--space) * 1)` | **1× space** | `article > section:not(:last-child)` (section divider) |
| `base.css:1039` | `margin-top: calc(var(--space) * 0.25)` | **0.25× space** | `.index-row__subtitle` |
| `base.css:1054` | `margin-bottom: calc(var(--space) * 0.5)` | **0.5× space** | `.index-row__categories` |
| `base.css:1165` | `margin-bottom: calc(var(--space) * 0.5)` | **0.5× space** | `.index-col--image` (mobile) |
| `base.css:1171` | `margin-bottom: calc(var(--space) * 0.5)` | **0.5× space** | `.index-col--item` (mobile) |
| `base.css:1176` | `margin-bottom: calc(var(--space) * 0.5)` | **0.5× space** | `.index-col--details` (mobile) |

### Hardcoded Margins (NOT using --space)
| Location | Declaration | Value | Context |
|----------|-------------|-------|---------|
| `base.css:243` | `margin-top: 0.5rem` | **0.5rem** | `.image-caption` |
| `base.css:244` | `margin-bottom: 2rem` | **2rem** | `.image-caption` |

### Utility Classes (margin-bottom)
| Class | Declaration | Value | Location |
|-------|-------------|-------|----------|
| `.mb--0` | `margin-bottom: 0` | 0 | `base.css:609` |
| `.mb--1` | `margin-bottom: var(--space)` | **1× space** | `base.css:613` |
| `.mb--2` | `margin-bottom: calc(var(--space) * 2)` | **2× space** | `base.css:617` |
| `.mb--3` | `margin-bottom: calc(var(--space) * 3)` | **3× space** | `base.css:621` |
| `.mb--4` | `margin-bottom: calc(var(--space) * 4)` | **4× space** | `base.css:625` |
| `.mb--6` | `margin-bottom: calc(var(--space) * 6)` | **6× space** | `base.css:629` |
| `.mb--8` | `margin-bottom: calc(var(--space) * 8)` | **8× space** | `base.css:633` |

---

## All Padding Declarations

### Resets
| Location | Declaration | Purpose |
|----------|-------------|---------|
| `base.css:25` | `padding: 0` | Universal reset on all elements |

### Structural Padding
| Location | Declaration | Value/Formula | Context |
|----------|-------------|---------------|---------|
| `base.css:68` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item` |
| `base.css:69` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item` |
| `base.css:96` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.columns` |
| `base.css:97` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.columns` |
| `base.css:182` | `margin-top: calc(var(--space) * 0.5)` | Related | Dropdown spacing |
| `base.css:200` | `padding: calc(var(--space) * 0.5) 0` | **0.5× space** vertical | `.header-menu__item` |
| `base.css:219` | `gap: calc(var(--space) * 0.5)` | **0.5× space** | `.header-menu__item.dark-toggle .toggle__label` |
| `base.css:379` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-4` @840px |
| `base.css:380` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-4` @840px |
| `base.css:393` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-2-left` @840px |
| `base.css:394` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-2-left` @840px |
| `base.css:399` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-2-right` @840px |
| `base.css:400` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-2-right` @840px |
| `base.css:409` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item` @840px |
| `base.css:410` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item` @840px |
| `base.css:417` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--end` @840px |
| `base.css:418` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--end` @840px |
| `base.css:428` | `padding: 0` | Reset | `.grid--header .grid__item--end` @840px |
| `base.css:467` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-4` @1140px |
| `base.css:468` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.grid__item--span-4` @1140px |
| `base.css:520` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.col-*--padded` variants |
| `base.css:521` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.col-*--padded` variants |
| `base.css:563` | `padding-top: 0` | Reset | `.grid--header > *` etc. |
| `base.css:564` | `padding-bottom: 0` | Reset | `.grid--header > *` etc. |
| `base.css:569` | `padding-top: 0` | Reset | `.grid--header a`, `.grid--footer a` |
| `base.css:570` | `padding-bottom: 0` | Reset | `.grid--header a`, `.grid--footer a` |
| `base.css:575` | `padding-top: 0` | Reset | `main.p--content article` |
| `base.css:576` | `padding-bottom: 0` | Reset | `main.p--content article` |
| `base.css:667` | `padding-top: 0` | Reset | `.project-header .grid__item--span-2-left` |
| `base.css:668` | `padding-bottom: 0` | Reset | `.project-header .grid__item--span-2-left` |
| `base.css:676` | `padding: var(--content-margin)` | **2× space** | `.project-header` |
| `base.css:768` | `padding-bottom: calc(var(--space) * 1)` | **1× space** | `article > section:not(:last-child)` |
| `base.css:872` | `padding-left: calc(var(--space) * 0.5)` | **0.5× space** | `.index-header-section` |
| `base.css:873` | `padding-right: calc(var(--space) * 0.5)` | **0.5× space** | `.index-header-section` |
| `base.css:935` | `padding: calc(var(--space) * 0.5)` | **0.5× space** | `.index-columns-header .index-col` |
| `base.css:951` | `padding: calc(var(--space) * 0.5)` | **0.5× space** | `.index-col` |
| `base.css:981` | `padding: 0` | Reset | `.index-row` |
| `base.css:1149` | `padding: calc(var(--space) * 2)` | **2× space** | `.index-empty` |
| `base.css:1160` | `padding: 0` | Reset | `.index-row` (mobile) |

### Hardcoded Padding (NOT using --space)
| Location | Declaration | Value | Context |
|----------|-------------|-------|---------|
| `base.css:118` | `padding-left: .5rem` | **0.5rem** | `.toggle__label` |
| `base.css:168` | `padding: 0` | 0 | `.header-menu__button` |
| `base.css:221` | `padding: 0` | 0 | `.header-menu__item.dark-toggle .toggle__label` |
| `base.css:332` | `padding: 0.5rem 1rem` | **0.5rem / 1rem** | `.btn` |

### Utility Classes (padding)
| Class | Declaration | Value | Location |
|-------|-------------|-------|----------|
| `.p--1` | `padding: var(--space)` | **1× space** | `base.css:536` |
| `.p--2` | `padding: calc(var(--space) * 2)` | **2× space** | `base.css:540` |
| `.p--content` | `padding: var(--content-margin)` | **2× space** | `base.css:545` |

### Utility Classes (padding-bottom)
| Class | Declaration | Value | Location |
|-------|-------------|-------|----------|
| `.pb--0` | `padding-bottom: 0` | 0 | `base.css:579` |
| `.pb--1` | `padding-bottom: var(--space)` | **1× space** | `base.css:583` |
| `.pb--2` | `padding-bottom: calc(var(--space) * 2)` | **2× space** | `base.css:587` |
| `.pb--3` | `padding-bottom: calc(var(--space) * 3)` | **3× space** | `base.css:591` |
| `.pb--4` | `padding-bottom: calc(var(--space) * 4)` | **4× space** | `base.css:595` |
| `.pb--6` | `padding-bottom: calc(var(--space) * 6)` | **6× space** | `base.css:599` |
| `.pb--8` | `padding-bottom: calc(var(--space) * 8)` | **8× space** | `base.css:603` |

---

## Spacing Scale in Use

### Current Multipliers (from --space base unit)
- **0.25×** — `calc(var(--space) * 0.25)` — Tight spacing (subtitle gap)
- **0.5×** — `calc(var(--space) * 0.5)` — **Most common** (internal padding, gaps)
- **1×** — `var(--space)` — Base unit (paragraphs, section dividers)
- **1.5×** — `calc(var(--space) * 1.5)` — Used in `.grid--project` row-gap
- **2×** — `calc(var(--space) * 2)` — Section spacing, content margin
- **3×** — `calc(var(--space) * 3)` — Large spacing utility
- **4×** — `calc(var(--space) * 4)` — Extra-large spacing utility
- **6×** — `calc(var(--space) * 6)` — Utility class only
- **8×** — `calc(var(--space) * 8)` — Utility class only

### Hardcoded Values (NOT using --space)
| Value | Usage Count | Locations |
|-------|-------------|-----------|
| `0.5rem` | 3 | `.toggle__label` padding-left, `.image-caption` margin-top, `.btn` padding |
| `1rem` | 1 | `.btn` padding (horizontal) |
| `2rem` | 1 | `.image-caption` margin-bottom |
| `14px` | 1 | `.image-caption` font-size |

---

## Existing Utility Classes

### Margin Utilities (bottom only)
- `.mb--0`, `.mb--1`, `.mb--2`, `.mb--3`, `.mb--4`, `.mb--6`, `.mb--8`

### Padding Utilities
- **All sides**: `.p--1`, `.p--2`, `.p--content`
- **Bottom only**: `.pb--0`, `.pb--1`, `.pb--2`, `.pb--3`, `.pb--4`, `.pb--6`, `.pb--8`

### Gaps (not margin/padding, but spacing-related)
| Location | Declaration | Context |
|----------|-------------|---------|
| `base.css:51` | `column-gap: var(--grid-gap)` | `.grid` (set to 0) |
| `base.css:219` | `gap: calc(var(--space) * 0.5)` | `.header-menu__item.dark-toggle .toggle__label` |
| `base.css:353` | `column-gap: var(--grid-gap)` | `.columns` @540px |
| `base.css:359` | `row-gap: calc(var(--space) * 1.5)` | `.grid--project` @540px |
| `base.css:1095` | `gap: calc(var(--space) * 0.75)` | `.index-filters` |
| `base.css:1182` | `gap: calc(var(--space) * 0.5)` | `.index-col--date` (mobile) |

---

## Recommendations for Refactor

### Phase 1: Define Spacing Tokens
Create semantic CSS variables for the spacing scale:
```css
:root {
  --space-0: 0;
  --space-1: calc(var(--space) * 0.25);   /* 0.25rem mobile, 0.375rem desktop */
  --space-2: calc(var(--space) * 0.5);    /* 0.5rem mobile, 0.75rem desktop */
  --space-3: var(--space);                /* 1rem mobile, 1.5rem desktop */
  --space-4: calc(var(--space) * 1.5);    /* 1.5rem mobile, 2.25rem desktop */
  --space-5: calc(var(--space) * 2);      /* 2rem mobile, 3rem desktop */
  --space-6: calc(var(--space) * 3);      /* 3rem mobile, 4.5rem desktop */
  --space-7: calc(var(--space) * 4);      /* 4rem mobile, 6rem desktop */
  --space-8: calc(var(--space) * 6);      /* 6rem mobile, 9rem desktop */
  --space-9: calc(var(--space) * 8);      /* 8rem mobile, 12rem desktop */
}
```

### Phase 2: Replace Hardcoded Values
- `.image-caption` margin: Replace `0.5rem` → `var(--space-2)`, `2rem` → `var(--space-5)`
- `.btn` padding: Replace `0.5rem 1rem` → `var(--space-2) var(--space-3)`
- `.toggle__label` padding-left: Replace `.5rem` → `var(--space-2)`

### Phase 3: Refactor Repeated Patterns
- **Replace** `calc(var(--space) * 0.5)` → `var(--space-2)` (20+ occurrences)
- **Replace** `calc(var(--space) * 2)` → `var(--space-5)` (5+ occurrences)
- **Replace** `calc(var(--space) * 1)` → `var(--space-3)` (explicit 1× multipliers)

### Phase 4: Audit Utility Classes
- Keep `.mb--*` and `.pb--*` utilities, but update values to use tokens
- Consider adding: `.mt--*`, `.pt--*`, `.mx--*`, `.px--*` if needed
- Consider adding: `gap` utilities (`.gap--2`, `.gap--3`, etc.)

### Phase 5: Validate
- Visual regression test all pages (home, projects, index, project detail)
- Verify responsive behavior at breakpoints (540px, 840px, 1140px)
- Confirm spacing scales correctly with `--space-scale` CMS setting

---

## Notes

1. **No inline styles found** in template files (`.njk`, `.html`)
2. **Grid system** uses `column-gap: 0` and relies on internal padding for spacing
3. **Content margin** (`var(--content-margin)`) is the outer padding for sections (2× space)
4. **Grid lines** (pseudo-elements) don't affect box model but are positioned using spacing variables
5. **Breakout utility** (`.grid__item--breakout`) uses viewport math, not affected by spacing scale

---

## Files Scanned
- `_includes/assets/css/base.css` (1185 lines)
- `_includes/assets/css/theme.njk` (52 lines)
- All `.njk` and `.html` template files (no inline styles found)
