/* =========================================================================
   LowDO ADU Library — shared.js
   Shared logic used by all five mockups:
     - Dark mode toggle (mirrors site's dark_mode.js)
     - Header menu drawer toggle
     - Download gate (email + checkbox before download)
     - Procedural SVG generators for thumbnails and floor plans
   ========================================================================= */

/* ---------- Dark mode (FOIT-safe early init) ---------- */
(function initDarkModeEarly() {
  const cs = localStorage.getItem("halide-color-scheme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (cs === "dark" || (!cs && prefersDark)) {
    document.documentElement.setAttribute("dark", "true");
  }
})();

/* ---------- Inject font preconnect + Google Font ----------
   Mirrors the production site's font (Overpass Mono from settings.yaml). */
(function injectFontLinks() {
  if (typeof document === "undefined" || !document.head) return;
  if (document.getElementById("lowdo-font-preconnect")) return;
  const pre1 = document.createElement("link");
  pre1.id = "lowdo-font-preconnect";
  pre1.rel = "preconnect";
  pre1.href = "https://fonts.googleapis.com";
  document.head.appendChild(pre1);
  const pre2 = document.createElement("link");
  pre2.rel = "preconnect";
  pre2.href = "https://fonts.gstatic.com";
  pre2.crossOrigin = "";
  document.head.appendChild(pre2);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;500;700&display=swap";
  document.head.appendChild(link);
})();

window.LOWDO_SHARED = {

  /* ---------- Dark mode wiring ---------- */
  initDarkMode() {
    const csToggle = document.querySelector(".dark-toggle input[type='checkbox']");
    if (!csToggle) return;
    if (document.documentElement.hasAttribute("dark")) csToggle.checked = true;
    csToggle.addEventListener("change", () => {
      document.documentElement.toggleAttribute("dark");
      localStorage.setItem("halide-color-scheme",
        document.documentElement.hasAttribute("dark") ? "dark" : "light");
    });
  },

  /* ---------- Header menu ---------- */
  initHeaderMenu() {
    const btn = document.querySelector(".header-menu__button");
    const drawer = document.querySelector(".header-menu__drawer");
    if (!btn || !drawer) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = drawer.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      drawer.setAttribute("aria-hidden", String(!open));
    });
    document.addEventListener("click", (e) => {
      if (!drawer.contains(e.target) && !btn.contains(e.target)) {
        drawer.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        drawer.setAttribute("aria-hidden", "true");
      }
    });
  },

  /* ---------- Download gate ----------
     A gate is a single instance attached to a trigger button and an
     adjacent .download-gate element. After the user enters an email and
     checks the consent box, all subsequent downloads in the session
     are unlocked (mirrors project.njk SESSION_KEY behavior).
   */
  SESSION_KEY: "adu-gate-passed",
  hasPassedGate() {
    try { return sessionStorage.getItem(this.SESSION_KEY) === "1"; }
    catch (e) { return false; }
  },
  markGatePassed() {
    try { sessionStorage.setItem(this.SESSION_KEY, "1"); } catch (e) {}
  },
  fakeDownload(label) {
    alert("Mockup download triggered:\n" + label + "\n\n(In production this would download the file.)");
  },

  initDownloadGate() {
    document.querySelectorAll(".js-download-trigger").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const label = btn.dataset.label || "ADU file";

        if (this.hasPassedGate()) { this.fakeDownload(label); return; }

        const gate = btn.closest(".js-gate-container")?.querySelector(".download-gate")
                  || btn.parentElement?.querySelector(".download-gate")
                  || btn.nextElementSibling;
        if (!gate || !gate.classList.contains("download-gate")) {
          this.fakeDownload(label); return;
        }
        // Toggle open
        if (gate.classList.contains("is-open")) {
          this.attemptSubmit(gate, label);
          return;
        }
        document.querySelectorAll(".download-gate.is-open").forEach((g) => g.classList.remove("is-open"));
        gate.classList.add("is-open");
        const email = gate.querySelector(".download-gate__email");
        if (email) email.focus();
      });
    });

    document.querySelectorAll(".download-gate").forEach((gate) => {
      const submitBtn = gate.querySelector(".js-gate-submit");
      if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.attemptSubmit(gate, submitBtn.dataset.label || "ADU file");
        });
      }
      gate.addEventListener("click", (e) => e.stopPropagation());
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(".download-gate.is-open").forEach((g) => g.classList.remove("is-open"));
    });
  },

  attemptSubmit(gate, label) {
    const email = gate.querySelector(".download-gate__email");
    const check = gate.querySelector("input[type='checkbox']");
    const valid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) && check && check.checked;
    if (!valid) {
      gate.classList.add("is-shake");
      setTimeout(() => gate.classList.remove("is-shake"), 400);
      if (email && !email.value) email.focus();
      return;
    }
    this.markGatePassed();
    gate.classList.remove("is-open");
    this.fakeDownload(label);
  },

  /* ---------- SVG generators ---------- */

  // Small isometric line drawing of an ADU. Scales by sqft & loft.
  // Output is an inline SVG string. Uses currentColor + accent vars.
  isoSvg(adu, opts) {
    opts = opts || {};
    const w = opts.width || 160;
    const h = opts.height || 120;
    // Base box dimensions scaled by sqft (visual cue, not literal)
    const scale = Math.min(1, 0.55 + adu.sqft / 1500);
    const bw = 70 * scale;
    const bh = 28 * scale;
    const bz = 24 * scale + (adu.loft ? 14 : 0); // height
    const cx = w / 2;
    const cy = h / 2 + 8;

    // Iso projection helper
    const iso = (x, y, z) => {
      const sx = cx + (x - y) * Math.cos(Math.PI / 6);
      const sy = cy + (x + y) * Math.sin(Math.PI / 6) - z;
      return [sx, sy];
    };

    const A = iso(-bw/2, -bh/2, 0);
    const B = iso( bw/2, -bh/2, 0);
    const C = iso( bw/2,  bh/2, 0);
    const D = iso(-bw/2,  bh/2, 0);
    const E = iso(-bw/2, -bh/2, bz);
    const F = iso( bw/2, -bh/2, bz);
    const G = iso( bw/2,  bh/2, bz);
    const H = iso(-bw/2,  bh/2, bz);

    // Roof: shed for cabin, gable for house
    let roof = "";
    if (adu.bedrooms >= 2 || adu.height === "two-story" || adu.height === "two-story + loft") {
      // gable: ridge along long axis
      const R1 = iso(0, -bh/2, bz + 14);
      const R2 = iso(0,  bh/2, bz + 14);
      roof = `<polygon points="${E[0]},${E[1]} ${R1[0]},${R1[1]} ${F[0]},${F[1]}" fill="var(--color-accent-5)" stroke="currentColor" stroke-width="1"/>
              <polygon points="${F[0]},${F[1]} ${R1[0]},${R1[1]} ${R2[0]},${R2[1]} ${G[0]},${G[1]}" fill="var(--color-accent-4)" stroke="currentColor" stroke-width="1"/>
              <polygon points="${H[0]},${H[1]} ${R2[0]},${R2[1]} ${G[0]},${G[1]}" fill="var(--color-accent-5)" stroke="currentColor" stroke-width="1"/>`;
    } else {
      // shed: tilts up to one side
      const E2 = iso(-bw/2, -bh/2, bz + 12);
      const F2 = iso( bw/2, -bh/2, bz + 12);
      roof = `<polygon points="${E2[0]},${E2[1]} ${F2[0]},${F2[1]} ${G[0]},${G[1]} ${H[0]},${H[1]}" fill="var(--color-accent-5)" stroke="currentColor" stroke-width="1"/>
              <polygon points="${E[0]},${E[1]} ${F[0]},${F[1]} ${F2[0]},${F2[1]} ${E2[0]},${E2[1]}" fill="var(--color-accent-4)" stroke="currentColor" stroke-width="1"/>`;
    }

    // Window slits on the front face
    const wins = [];
    const winY = -bh/2;
    const wcount = adu.bedrooms === 2 ? 4 : 3;
    for (let i = 0; i < wcount; i++) {
      const wx1 = -bw/2 + (i + 0.5) * (bw / wcount) - 3;
      const wx2 = wx1 + 6;
      const wz1 = 6;
      const wz2 = bz - 4;
      const W1 = iso(wx1, winY, wz1);
      const W2 = iso(wx2, winY, wz1);
      const W3 = iso(wx2, winY, wz2);
      const W4 = iso(wx1, winY, wz2);
      wins.push(`<polygon points="${W1[0]},${W1[1]} ${W2[0]},${W2[1]} ${W3[0]},${W3[1]} ${W4[0]},${W4[1]}" fill="var(--color-accent-1)" opacity="0.35"/>`);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="color: var(--color-accent-1);">
      <!-- floor (visible front and right) -->
      <polygon points="${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]} ${D[0]},${D[1]}" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2"/>
      <!-- box -->
      <polygon points="${E[0]},${E[1]} ${F[0]},${F[1]} ${G[0]},${G[1]} ${H[0]},${H[1]}" fill="var(--color-background)" stroke="currentColor" stroke-width="1"/>
      <!-- front face -->
      <polygon points="${A[0]},${A[1]} ${B[0]},${B[1]} ${F[0]},${F[1]} ${E[0]},${E[1]}" fill="var(--color-background)" stroke="currentColor" stroke-width="1"/>
      <!-- right face -->
      <polygon points="${B[0]},${B[1]} ${C[0]},${C[1]} ${G[0]},${G[1]} ${F[0]},${F[1]}" fill="var(--color-accent-5)" stroke="currentColor" stroke-width="1"/>
      <!-- windows -->
      ${wins.join("\n")}
      <!-- roof -->
      ${roof}
    </svg>`;
  },

  // Schematic floor plan for a given ADU. Returns SVG string.
  // Always normalized to a 200×140 viewBox so it composes cleanly in any cell.
  planSvg(adu) {
    const W = 200, H = 140;
    const m = 8;             // outer margin
    const W2 = W - 2*m;      // usable width
    const H2 = H - 2*m;      // usable height

    // Outer wall
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" style="color: var(--color-accent-1);">
      <rect x="${m}" y="${m}" width="${W2}" height="${H2}" fill="var(--color-background)" stroke="currentColor" stroke-width="1.4"/>`;

    // Layout depends on bedrooms / loft
    if (adu.bedrooms === 1 && adu.loft) {
      // Single open room with loft outline (dashed) above
      svg += `<text x="${W/2}" y="${H/2 - 8}" font-size="9" fill="currentColor" text-anchor="middle" font-family="monospace">LIVING + KITCHEN</text>`;
      svg += `<rect x="${m + 8}" y="${m + 8}" width="${W2/2 - 8}" height="${H2/2}" fill="none" stroke="currentColor" stroke-dasharray="3 2" stroke-width="0.8"/>`;
      svg += `<text x="${m + 8 + (W2/2 - 8)/2}" y="${m + 8 + (H2/2)/2 + 3}" font-size="7" fill="currentColor" text-anchor="middle" font-family="monospace">LOFT ABOVE</text>`;
      // ladder mark
      svg += `<line x1="${W - m - 14}" y1="${m + 6}" x2="${W - m - 14}" y2="${H - m - 6}" stroke="currentColor" stroke-width="1"/>`;
      svg += `<line x1="${W - m - 18}" y1="${m + 6}" x2="${W - m - 18}" y2="${H - m - 6}" stroke="currentColor" stroke-width="1"/>`;
      for (let y = m + 12; y < H - m - 4; y += 6) {
        svg += `<line x1="${W - m - 18}" y1="${y}" x2="${W - m - 14}" y2="${y}" stroke="currentColor" stroke-width="0.8"/>`;
      }
      // bath
      svg += `<rect x="${m + 4}" y="${H - m - 28}" width="40" height="22" fill="var(--color-accent-5)" stroke="currentColor" stroke-width="0.8"/>`;
      svg += `<text x="${m + 24}" y="${H - m - 14}" font-size="6" fill="currentColor" text-anchor="middle" font-family="monospace">BATH</text>`;
    } else if (adu.bedrooms === 1 && !adu.loft) {
      // Studio: bed area at one end, living/kitchen at other
      svg += `<line x1="${W/2}" y1="${m}" x2="${W/2}" y2="${H - m}" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2"/>`;
      svg += `<text x="${W/4 + m/2}" y="${H/2 + 3}" font-size="8" fill="currentColor" text-anchor="middle" font-family="monospace">BEDROOM</text>`;
      svg += `<text x="${3*W/4 - m/2}" y="${H/2 + 3}" font-size="8" fill="currentColor" text-anchor="middle" font-family="monospace">LIVING + KIT.</text>`;
      // bath
      svg += `<rect x="${W/2 - 22}" y="${m + 4}" width="44" height="22" fill="var(--color-accent-5)" stroke="currentColor" stroke-width="0.8"/>`;
      svg += `<text x="${W/2}" y="${m + 18}" font-size="6" fill="currentColor" text-anchor="middle" font-family="monospace">BATH</text>`;
    } else {
      // 2 bed
      svg += `<line x1="${W/3}" y1="${m}" x2="${W/3}" y2="${H/2}" stroke="currentColor" stroke-width="0.8"/>`;
      svg += `<line x1="${m}" y1="${H/2}" x2="${W - m}" y2="${H/2}" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2"/>`;
      svg += `<line x1="${2*W/3}" y1="${m}" x2="${2*W/3}" y2="${H/2}" stroke="currentColor" stroke-width="0.8"/>`;
      svg += `<text x="${W/6 + m/2}" y="${H/4 + 3}" font-size="7" fill="currentColor" text-anchor="middle" font-family="monospace">BED 1</text>`;
      svg += `<text x="${W/2}" y="${H/4 + 3}" font-size="7" fill="currentColor" text-anchor="middle" font-family="monospace">BATH</text>`;
      svg += `<text x="${5*W/6 - m/2}" y="${H/4 + 3}" font-size="7" fill="currentColor" text-anchor="middle" font-family="monospace">BED 2</text>`;
      svg += `<text x="${W/2}" y="${3*H/4 + 3}" font-size="9" fill="currentColor" text-anchor="middle" font-family="monospace">LIVING / KITCHEN / DINING</text>`;
    }

    // Door indicator on south wall
    const doorX = adu.bedrooms === 2 ? W/2 : 3*W/4;
    svg += `<line x1="${doorX - 6}" y1="${H - m}" x2="${doorX + 6}" y2="${H - m}" stroke="var(--color-background)" stroke-width="3"/>`;
    svg += `<path d="M ${doorX - 6} ${H - m} A 12 12 0 0 1 ${doorX + 6} ${H - m}" fill="none" stroke="currentColor" stroke-width="0.7"/>`;

    // North arrow
    svg += `<g transform="translate(${W - 14}, ${14})">
      <line x1="0" y1="6" x2="0" y2="-6" stroke="currentColor" stroke-width="0.8"/>
      <polygon points="0,-7 -2,-3 2,-3" fill="currentColor"/>
      <text x="0" y="14" font-size="6" fill="currentColor" text-anchor="middle" font-family="monospace">N</text>
    </g>`;

    svg += `</svg>`;
    return svg;
  },

  /* ---------- HTML helpers ---------- */
  esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }
};

/* ---------- Standard header + footer rendering ---------- */
window.LOWDO_LAYOUT = {
  header(currentPage) {
    return `
<header class="p--content">
  <div class="grid grid--header">
    <div class="grid__item col-1 header-title">
      <a href="../" class="link-nostyle"><span>LOW DESIGN OFFICE</span></a>
      <span class="header-subtitle">ADU LIBRARY — MOCKUPS</span>
    </div>
    <span class="grid__item col-2 header-subtitle" style="display:none">REALIZING MORE WITH LESS</span>
    <span class="grid__item col-3 header-subtitle" style="display:none">AUSTIN, TX</span>
    <div class="grid__item col-4 grid__item--end">
      <div class="header-menu">
        <button class="header-menu__button" aria-expanded="false" aria-label="Menu">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
            <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" stroke-width="2"/>
            <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" stroke-width="2"/>
            <line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <nav class="header-menu__drawer" aria-label="Main navigation" aria-hidden="true">
    <a href="./index.html" class="header-menu__item${currentPage === "index" ? " is-current" : ""}">MOCKUP INDEX</a>
    <a href="./a-configurator.html" class="header-menu__item${currentPage === "a" ? " is-current" : ""}">A · CONFIGURATOR</a>
    <a href="./b-catalog.html" class="header-menu__item${currentPage === "b" ? " is-current" : ""}">B · CATALOG</a>
    <a href="./c-compare.html" class="header-menu__item${currentPage === "c" ? " is-current" : ""}">C · COMPARE</a>
    <a href="./d-tiers.html" class="header-menu__item${currentPage === "d" ? " is-current" : ""}">D · TIERS</a>
    <a href="./e-spectrum.html" class="header-menu__item${currentPage === "e" ? " is-current" : ""}">E · SPECTRUM</a>
    <div class="header-menu__item dark-toggle">
      <label class="toggle__label">
        <span class="toggle__text">DARK MODE</span>
        <svg width="14" height="14" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="7.5" fill="var(--color-text)" stroke="var(--color-text)"/>
          <path d="M1 8a7 7 0 007 7V1a7 7 0 00-7 7z" fill="var(--color-background)"/>
        </svg>
        <input type="checkbox" class="toggle__checkbox" />
      </label>
    </div>
  </nav>
</header>`;
  },

  footer() {
    return `
<footer class="p--content">
  <div class="footer__body">
    <div class="footer__logo-column"><span class="uppercase muted">LowDO</span></div>
    <div class="footer__table">
      <div class="footer__row">
        <div class="footer__column">
          <div class="footer__section-label">Mockups</div>
          <nav class="footer__nav">
            <a href="./index.html" class="footer__nav-link">All mockups</a>
            <a href="./PLAN.md" class="footer__nav-link">Plan</a>
          </nav>
        </div>
        <div class="footer__column">
          <div class="footer__section-label">Status</div>
          <span class="muted">Evaluation prototype · not production</span>
        </div>
        <div class="footer__column">
          <div class="footer__section-label">Studio</div>
          <span class="muted">Low Design Office · Austin TX</span>
        </div>
      </div>
    </div>
  </div>
</footer>`;
  }
};

/* ---------- Boot ---------- */
window.addEventListener("DOMContentLoaded", () => {
  // Inject header + footer if placeholders exist
  const headerSlot = document.getElementById("layout-header");
  const footerSlot = document.getElementById("layout-footer");
  const page = document.body.dataset.page || "index";
  if (headerSlot) headerSlot.innerHTML = window.LOWDO_LAYOUT.header(page);
  if (footerSlot) footerSlot.innerHTML = window.LOWDO_LAYOUT.footer();

  window.LOWDO_SHARED.initDarkMode();
  window.LOWDO_SHARED.initHeaderMenu();
  window.LOWDO_SHARED.initDownloadGate();

  // Each mockup may call its own boot fn after DOMContentLoaded
  if (typeof window.bootMockup === "function") {
    window.bootMockup();
    // Re-init download gate after mockup-specific content is rendered
    window.LOWDO_SHARED.initDownloadGate();
  }
});

/* ---------- Shake animation for invalid gate ---------- */
const _styleEl = document.createElement("style");
_styleEl.textContent = `
@keyframes lowdoShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.download-gate.is-shake { animation: lowdoShake 200ms ease; }
`;
document.head.appendChild(_styleEl);
