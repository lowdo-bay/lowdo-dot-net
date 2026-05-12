/* =========================================================================
   LowDO ADU Library — mock dataset
   Same shape as the spec in PLAN.md §2. Used by all five mockups.
   ========================================================================= */

window.LOWDO_ADUS = [
  {
    id: "ADU-001",
    name: "Loft Cabin",
    tier: "Essential",
    bedrooms: 1,
    loft: true,
    stair: "ladder",
    sqft: 380,
    budget_low: 65000,
    budget_high: 95000,
    orientation: "any",
    footprint: "12×16 ft",
    height: "single + loft",
    features: ["loft", "porch"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "The smallest envelope. A single open room with sleeping loft above, accessed by ladder. Designed for the maximum yield from a 192-sqft footprint."
  },
  {
    id: "ADU-002",
    name: "Garden Studio",
    tier: "Essential",
    bedrooms: 1,
    loft: false,
    stair: "none",
    sqft: 420,
    budget_low: 72000,
    budget_high: 105000,
    orientation: "east-west",
    footprint: "14×30 ft",
    height: "single",
    features: ["porch"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "Single-story studio with deep eaves. The east-west orientation maximizes morning and evening light through the long facade."
  },
  {
    id: "ADU-003",
    name: "Switchback",
    tier: "Standard",
    bedrooms: 1,
    loft: true,
    stair: "switchback",
    sqft: 540,
    budget_low: 92000,
    budget_high: 135000,
    orientation: "any",
    footprint: "16×20 ft",
    height: "two-story",
    features: ["stair", "loft", "deck"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "A real switchback stair to a private upstairs bedroom and bath. The downstairs is a continuous live/work room with a small deck."
  },
  {
    id: "ADU-004",
    name: "Two Volume",
    tier: "Standard",
    bedrooms: 1,
    loft: false,
    stair: "straight",
    sqft: 580,
    budget_low: 105000,
    budget_high: 145000,
    orientation: "north-south",
    footprint: "14×42 ft",
    height: "split",
    features: ["stair", "porch"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "Two simple shed volumes hinged at the kitchen. Bedroom in the smaller, taller volume; living + kitchen in the longer one."
  },
  {
    id: "ADU-005",
    name: "Courtyard",
    tier: "Plus",
    bedrooms: 2,
    loft: false,
    stair: "none",
    sqft: 720,
    budget_low: 145000,
    budget_high: 195000,
    orientation: "any",
    footprint: "L-plan 28×26 ft",
    height: "single",
    features: ["porch", "deck", "courtyard"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "Two bedrooms wrapped around a small private courtyard. All single-story, accessible-friendly throughout."
  },
  {
    id: "ADU-006",
    name: "Stair House",
    tier: "Plus",
    bedrooms: 2,
    loft: false,
    stair: "straight",
    sqft: 820,
    budget_low: 165000,
    budget_high: 230000,
    orientation: "any",
    footprint: "16×26 ft",
    height: "two-story",
    features: ["stair", "porch", "deck"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "A small two-story house. Living + kitchen + half-bath downstairs; two bedrooms and full bath upstairs. The stair is its central organizing element."
  },
  {
    id: "ADU-007",
    name: "Long House",
    tier: "Plus",
    bedrooms: 2,
    loft: false,
    stair: "none",
    sqft: 880,
    budget_low: 175000,
    budget_high: 240000,
    orientation: "east-west",
    footprint: "14×62 ft",
    height: "single",
    features: ["porch", "deck"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "A long, narrow single-story bar with two bedrooms at one end and a full living/dining/kitchen at the other. Cross-ventilated."
  },
  {
    id: "ADU-008",
    name: "Spiral",
    tier: "Standard",
    bedrooms: 1,
    loft: true,
    stair: "spiral",
    sqft: 460,
    budget_low: 88000,
    budget_high: 125000,
    orientation: "any",
    footprint: "16×16 ft",
    height: "two-story",
    features: ["loft", "stair"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "A square footprint two-story with a steel spiral stair connecting the open downstairs to a sleeping loft above."
  },
  {
    id: "ADU-009",
    name: "Office + Studio",
    tier: "Essential",
    bedrooms: 1,
    loft: false,
    stair: "none",
    sqft: 360,
    budget_low: 62000,
    budget_high: 88000,
    orientation: "any",
    footprint: "12×30 ft",
    height: "single",
    features: ["porch"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "A bookend plan: dedicated home-office wing on one side, a studio bed/bath on the other. Designed for hybrid live-work."
  },
  {
    id: "ADU-010",
    name: "Big Loft",
    tier: "Plus",
    bedrooms: 2,
    loft: true,
    stair: "switchback",
    sqft: 940,
    budget_low: 195000,
    budget_high: 265000,
    orientation: "any",
    footprint: "20×24 ft",
    height: "two-story + loft",
    features: ["stair", "loft", "porch", "deck"],
    deliverables: ["pdf-drawings", "3d-model", "spec-sheet", "permit-docs"],
    summary: "The most generous design. Two bedrooms with full bath upstairs, large loft above. Living downstairs opens to a covered porch and rear deck."
  }
];

/* Lookup helpers */
window.LOWDO_HELPERS = {
  formatPrice(n) {
    return "$" + Math.round(n / 1000) + "K";
  },
  priceRange(adu) {
    return this.formatPrice(adu.budget_low) + "–" + this.formatPrice(adu.budget_high);
  },
  budgetBucket(adu) {
    // Bucket on midpoint
    const mid = (adu.budget_low + adu.budget_high) / 2;
    if (mid < 100000) return "under-100k";
    if (mid < 150000) return "100k-150k";
    if (mid < 200000) return "150k-200k";
    return "over-200k";
  },
  tierColor(tier) {
    return {
      Essential: "var(--color-accent-3)",
      Standard:  "var(--color-accent-2)",
      Plus:      "var(--color-accent-1)"
    }[tier] || "var(--color-accent-2)";
  },
  deliverableLabel(d) {
    return {
      "pdf-drawings": "PDF Drawings",
      "3d-model":     "3D Model",
      "spec-sheet":   "Materials & Cost Spec",
      "permit-docs":  "Permit / Code Docs"
    }[d] || d;
  },
  deliverableFormat(d) {
    return {
      "pdf-drawings": "PDF",
      "3d-model":     "SKP / RVT",
      "spec-sheet":   "XLSX",
      "permit-docs":  "PDF"
    }[d] || "FILE";
  },
  stairLabel(s) {
    return {
      "ladder":     "Ladder",
      "spiral":     "Spiral stair",
      "straight":   "Straight stair",
      "switchback": "Switchback stair",
      "none":       "Single-story"
    }[s] || s;
  }
};
