# Logia Creative Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Logia Creative company profile to minimalist luxury with solid dark/light themes, fixed CTA/testimonial/rate-card bugs, preserved 3D concepts and filter logic.

**Architecture:** Keep App Router + existing section components; fix theme via next-themes only (delete parallel class-toggle), add serif/sans via next/font, rebuild testimonial as controlled carousel, extend pricing as tab+accordion data-driven UI, visual-only refresh elsewhere.

**Tech Stack:** Next.js 15.2.1 (App Router), React 19, TypeScript 5.7, Tailwind CSS 3.4, Framer Motion 12 + motion 13, next-themes 0.4.4, lucide-react, next/font (Fraunces + Inter).

**Spec:** Inline PRD §A (§A1–§A9) + execution phases §B (Fase 0–8) from conversation 2026-09-26. Copy source of truth: §A6 rate-card nominals/terms Bahasa Indonesia verbatim.

## Global Constraints

- Keep nav sections Home, About, Services, Portfolio, Pricing, Contact; keep Archive; no payment system.
- Keep Selected Work + Archive filter/grid/counter logic identical; visual/animation changes only.
- Keep 3D tilt/depth/parallax concepts (Hero InteractiveShape, PortfolioCard tilt+glare, Logo3DBackground, MorphingBlob); refine, never flatten to flat.
- No new heavy deps (no Three.js); use installed framer-motion/motion/next-themes/lucide only.
- All prices/terms copy Bahasa Indonesia persis §A6; no translation, no nominal changes.
- No `href="#"` dead links; PDF button links real `/rate-card-logia.pdf` or labeled coming-soon disabled state.
- `npm run lint` + `npm run build` zero errors; zero console errors; next/image with alt; WCAG AA contrast both themes; mobile/tablet/desktop responsive; honor `prefers-reduced-motion`.
- One easing `cubic-bezier(0.22,1,0.36,1)` (`--ease-out-expo`) everywhere.
- Commit per fase with clear message + `Co-Authored-By: Claude Code <noreply@anthropic.com>`.

## Review Focus

- Light-mode global `!important` overrides restyle dark-banner content black-on-black; fixed CTA must stay white-on-black in both themes.
- ThemeToggle local useState desyncs from next-themes provider and loses persistence; fixed toggle must persist across reload and follow system on first visit.
- Duplicate `id="portfolio"` (BackgroundTargetSection + PortfolioSection) plus navbar `#home/#services/#contact` vs real `#top/#layanan/#kontak` breaks anchor scroll; fixed anchors must land with 80px navbar offset.
- Testimonial scroll-reel renders 14 testimonials ×5 copies ×3 columns (~210 images) with per-char animation; replacement must render ≤14 slides with controls and keyboard nav.
- Rate-card `tier.price !== "Custom"` prefix prints "Mulai" on fixed prices; replacement must print exact §A6 strings ("Rp 350.000", "Rp 850.000", "Rp 1.500.000 / Bulan", "Mulai dari Rp 2.750.000") with no invented prefix.

---

### Task 1: Fase 0 — Audit lock (map + root causes proven)

**Files:**
- Create: `docs/superpowers/plans/2026-09-26-logia-audit.md`
- Modify: none
- Test: `scripts/verify-audit.mjs` (create, run, then delete or keep as docs script)

**Interfaces:**
- Consumes: existing `src/app/page.tsx`, `src/components/*`, `src/components/sections/*`, `src/app/globals.css`
- Produces: component map table + 5 proven root causes consumed by Tasks 2/5/6/7/10

- [ ] **Step 1: Write the failing check**

```js
// scripts/verify-audit.mjs
import { execSync } from "node:child_process";
const grep = (p) => execSync(`grep -rn "${p}" src --include="*.tsx" --include="*.css" || true`, { encoding: "utf8" });
const checks = [
  ["CTA override", grep("html:not(.dark) h2").includes("color")],
  ["testimonial 5x dup", grep("testimonials, ...testimonials").length > 0 || grep("col1 = ").includes("testimonials")],
  ["toggle local state", grep("useState(true)").includes("ThemeToggle") || grep("setIsDark").length > 0],
  ["dead href", grep('href="#"').length > 0],
  ["dup id portfolio", (grep('id="portfolio"').match(/id="portfolio"/g) || []).length >= 2],
];
let fail = 0;
for (const [n, ok] of checks) { console.log(`${ok ? "FOUND" : "MISS"}: ${n}`); if (!ok) fail++; }
if (fail) { console.error(`${fail} root causes unproven`); process.exit(1); }
console.log("audit: 5/5 proven");
```

- [ ] **Step 2: Run check to verify it fails or proves**

Run: `node scripts/verify-audit.mjs`
Expected: PASS with `audit: 5/5 proven` (proves bugs exist; if any MISS, read the file and fix the grep, do not proceed with unproven cause).

- [ ] **Step 3: Write minimal audit doc**

```md
# Logia Audit 2026-09-26
| Req | Owner file |
|---|---|
| theme toggle | `src/components/ThemeToggle.tsx` (local useState, ignores provider) + `src/components/ThemeProvider.tsx` (next-themes, defaultTheme dark, enableSystem false) + `src/app/layout.tsx:64-70` |
| splash | `src/components/SplashScreen.tsx` (2.7s, bg-black hardcoded) ; `src/components/SplashWrapper.tsx` unused ; mounted in `src/app/page.tsx:47` |
| testimonial | `src/components/sections/TestimonialSection.tsx` + `src/components/ui/scroll-reel-testimonials.tsx:40-43` (col1/col2/col3 each 5x dup) |
| rate card | `src/components/sections/PricingSection.tsx:8-70` (4 tiers only, dead `href="#"` line 210, modal terms not collapsible) |
| CTA | `src/components/sections/FooterSection.tsx:55-79` (bg-black fixed) vs `src/app/globals.css:250-263` (`html:not(.dark) h2 color:#000 !important` => black-on-black) |
| Selected Work/Archive filter | `src/components/sections/PortfolioSection.tsx:213-230` (active/displayed +150ms), carousel `src/components/ui/hero-carousel.tsx`, overlay Archive lines 318-368 |
| 3D keep | `HeroSection.tsx:12-146` InteractiveShape, `PortfolioSection.tsx:95-211` PortfolioCard tilt+glare, `Logo3DBackground.tsx`, `MorphingBlob.tsx` |
| anchors broken | `LiquidNavbar.tsx:13-20` (#home/#about/#services/#contact) vs real ids top/about/layanan/portfolio/pricing/kontak; dup id portfolio (`BackgroundTargetSection.tsx:145` + `PortfolioSection.tsx:263`) |
```

- [ ] **Step 4: Run check to verify it passes**

Run: `node scripts/verify-audit.mjs`
Expected: `audit: 5/5 proven`.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-26-logia-audit.md scripts/verify-audit.mjs
git commit -m "docs: fase 0 audit map + 5 root causes

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 2: Fase 1a — Theme system SSR-safe (next-themes only)

**Files:**
- Modify: `src/components/ThemeProvider.tsx`, `src/components/ThemeToggle.tsx`, `src/app/layout.tsx`
- Test: `scripts/verify-theme.mjs`

**Interfaces:**
- Consumes: `useTheme` from `next-themes`
- Produces: `export function ThemeToggle(): JSX.Element` (mounted state guard, Sun/Moon lucide, persists to localStorage via next-themes, follows system on first visit); provider `attribute="class" defaultTheme="system" enableSystem`

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-theme.mjs
import fs from "node:fs";
const t = fs.readFileSync("src/components/ThemeToggle.tsx", "utf8");
const p = fs.readFileSync("src/components/ThemeProvider.tsx", "utf8");
const l = fs.readFileSync("src/app/layout.tsx", "utf8");
const fails = [];
if (t.includes("useState(true)") || t.includes("setIsDark")) fails.push("toggle still uses local useState");
if (!t.includes("useTheme") || !t.includes("mounted")) fails.push("toggle must use useTheme + mounted guard");
if (t.includes("☀️") || t.includes("🌙")) fails.push("emoji toggle forbidden, use lucide Sun/Moon");
if (!p.includes('defaultTheme="system"') || !p.includes("enableSystem")) fails.push("provider must default system + enableSystem");
if (l.includes('defaultTheme="dark"')) fails.push("layout still forces default dark");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("theme: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-theme.mjs`
Expected: FAIL listing local useState + default dark.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ThemeProvider.tsx
"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>{children}</NextThemesProvider>;
}
```

```tsx
// src/components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <button className="p-2 rounded-lg glass-container min-h-[44px] min-w-[44px]" aria-label="Toggle theme" disabled />;
  const isDark = resolvedTheme === "dark";
  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")} className="p-2 rounded-lg glass-container min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
```

In `src/app/layout.tsx` change provider props to `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>` (keep `suppressHydrationWarning` on `<html>`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-theme.mjs && npm run lint`
Expected: `theme: ok`, lint clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/ThemeToggle.tsx src/components/ThemeProvider.tsx src/app/layout.tsx scripts/verify-theme.mjs
git commit -m "feat: fase 1a SSR-safe theme via next-themes, persisted, system default

Sun/Moon lucide, mounted guard lawan FOUC. Pilihan: hapus toggle paralel
useState agar satu sumber kebenaran.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 3: Fase 1b — Fonts + minimalist-luxury tokens

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`
- Test: `scripts/verify-tokens.mjs`

**Interfaces:**
- Consumes: `next/font/google` Fraunces + Inter
- Produces: CSS vars `--font-display/--font-sans`, `--bg-primary #FAFAF8/#0A0A0A`, `--accent-bronze #A08C6A`, `--ease-out-expo`, `.font-display` utility; CTA banner excluded from light-mode heading override

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-tokens.mjs
import fs from "node:fs";
const l = fs.readFileSync("src/app/layout.tsx", "utf8");
const c = fs.readFileSync("src/app/globals.css", "utf8");
const fails = [];
if (!l.includes("Fraunces") || !l.includes("Inter")) fails.push("layout must load Fraunces + Inter via next/font");
if (!c.includes("--font-display") || !c.includes("--accent-bronze") || !c.includes("--ease-out-expo")) fails.push("tokens missing");
if (!c.includes("#FAFAF8") || !c.includes("#0A0A0A")) fails.push("near-white/near-black tokens missing");
if (c.includes("html:not(.dark) h1,") && !c.includes(".cta-dark")) fails.push("light h-override must exclude .cta-dark scope");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("tokens: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-tokens.mjs`
Expected: FAIL (only Plus_Jakarta_Sans, no bronze token).

- [ ] **Step 3: Write minimal implementation**

In `src/app/layout.tsx`, replace font block:

```tsx
import { Fraunces, Inter } from "next/font/google";
const fontDisplay = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display", display: "swap" });
const fontSans = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });
// body className: `${fontDisplay.variable} ${fontSans.variable} font-sans antialiased ...`
```

In `src/app/globals.css`, inside `@layer base :root` add:

```css
--font-display: "Fraunces", Georgia, serif;
--accent-bronze: #A08C6A;
--ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
--bg-primary: #FAFAF8;
```

In `.dark` set `--bg-primary: #0A0A0A;`. Add utility `.font-display { font-family: var(--font-display); }`. Change light heading override selector from `html:not(.dark) h1, ...` to `html:not(.dark) :not(.cta-dark) > h1, html:not(.dark) :not(.cta-dark) h1, ...` — minimal working form: prefix each with `:not(.cta-dark *)` guard, or simplest: add after the block:

```css
/* CTA dark banner keeps white headings in light mode */
html:not(.dark) .cta-dark h1, html:not(.dark) .cta-dark h2, html:not(.dark) .cta-dark p, html:not(.dark) .cta-dark span, html:not(.dark) .cta-dark svg { color: #fff !important; }
```

Delete `Plus_Jakarta_Sans` import. Keep Plus_Jakarta fallback out (YAGNI: two fonts only).

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-tokens.mjs && npm run lint`
Expected: `tokens: ok`, lint clean.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css scripts/verify-tokens.mjs
git commit -m "feat: fase 1b Fraunces display + Inter body, luxury tokens

Serif Fraunces headline premium, Inter body netral. Bronze #A08C6A tipis.
FAFAF8/0A0A0A basis. Perlu konfirmasi owner: palet final bronze ini.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 4: Fase 2 — Splash redesign (≤2s, skippable, theme-aware)

**Files:**
- Modify: `src/components/SplashScreen.tsx`
- Test: manual + `scripts/verify-splash.mjs`

**Interfaces:**
- Consumes: `onComplete?: () => void`
- Produces: `export function SplashScreen({ onComplete }: { onComplete?: () => void }): JSX.Element` — wordmark LOGIA CREATIVE, thin progress bar, Skip button, auto-dismiss ≤1800ms, `prefers-reduced-motion` instant path, theme-aware via CSS vars (no hardcoded bg-black only)

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-splash.mjs
import fs from "node:fs";
const s = fs.readFileSync("src/components/SplashScreen.tsx", "utf8");
const fails = [];
if (s.includes("2700")) fails.push("dismiss must be <=2000ms");
if (!s.includes("prefers-reduced-motion") && !s.includes("matchMedia")) fails.push("must respect reduced-motion");
if (!s.includes("Skip")) fails.push("skip button required");
if (s.includes("bg-black text-white") && !s.includes("dark:")) fails.push("splash must be theme-aware, not hardcoded black-only");
if (!s.includes("progress") && !s.includes("Progress")) fails.push("thin progress indicator required");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("splash: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-splash.mjs`
Expected: FAIL (2700ms, no reduced-motion, hardcoded bg-black).

- [ ] **Step 3: Write minimal implementation**

Replace `SplashScreen.tsx` body: keep `isVisible` + `handleExit`; drop typing loop; use single 1600ms timeout (600ms if reduced-motion); render wordmark with `font-display`, hairline progress via framer-motion `scaleX 0→1 duration 1.6` (skip animation if reduced-motion); container `bg-[var(--bg-primary)] text-[var(--text-primary)]`; Skip button bottom-right `onClick={handleExit}` + `aria-label="Skip intro"`; exit fade 0.4s same easing.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-splash.mjs && npm run lint`
Expected: `splash: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/components/SplashScreen.tsx scripts/verify-splash.mjs
git commit -m "feat: fase 2 splash minimalist luxury <=1.8s skippable

Wordmark + hairline progress, theme-aware, reduced-motion instant.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 5: Fase 3a — CTA contrast fix (theme-aware)

**Files:**
- Modify: `src/components/sections/FooterSection.tsx`, `src/app/globals.css`
- Test: `scripts/verify-cta.mjs`

**Interfaces:**
- Consumes: `.cta-dark` scope from Task 3
- Produces: CTA banner unchanged structure (`Ready to elevate your brand?` h2 + copy + `Mulai Diskusi Proyek` button) but readable both themes; no logic change

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-cta.mjs
import fs from "node:fs";
const f = fs.readFileSync("src/components/sections/FooterSection.tsx", "utf8");
const c = fs.readFileSync("src/app/globals.css", "utf8");
const fails = [];
if (!f.includes("cta-dark")) fails.push("banner must carry cta-dark scope class");
if (!c.includes(".cta-dark")) fails.push("css must scope cta-dark exceptions");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("cta: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-cta.mjs`
Expected: FAIL (no cta-dark).

- [ ] **Step 3: Write minimal implementation**

In `FooterSection.tsx` banner div add `cta-dark` to class list: `p-10 ... rounded-[2rem] bg-black text-white cta-dark ...`. Change h2 to `className="... text-white font-display"` (explicit, no `!important` needed once scoped). Change copy `text-[#999999]` keep (passes on black). Change button to `bg-white text-black` keep. Add `aria-label` unchanged.

In `globals.css` ensure the `.cta-dark` exception block from Task 3 exists (if Task 3 done, verify; else add the 1 rule).

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-cta.mjs && npm run lint`
Expected: `cta: ok`. Manual: toggle light/dark, banner text white on black both.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/FooterSection.tsx src/app/globals.css scripts/verify-cta.mjs
git commit -m "fix: fase 3a CTA readable light+dark via cta-dark scope

Root cause: global light h2->#000 !important menimpa banner bg-black.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 6: Fase 3b — Testimonial carousel rebuild (no dup)

**Files:**
- Create: `src/components/ui/testimonial-carousel.tsx`
- Modify: `src/components/sections/TestimonialSection.tsx`
- Delete: `src/components/ui/scroll-reel-testimonials.tsx` (remove import; delete file)
- Test: `scripts/verify-testimonials.mjs`

**Interfaces:**
- Consumes: `TESTIMONIALS: { quote, author, role?, image, alt }[]` (reuse existing 14 entries, first 6 curated; keep Unsplash URLs as placeholder until owner confirms A9)
- Produces: `export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }): JSX.Element` — drag/auto-scroll 5s pause-on-hover, dots+arrows, keyboard ArrowLeft/Right, alt text, reduced-motion disables autoplay

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-testimonials.mjs
import fs from "node:fs";
const sec = fs.readFileSync("src/components/sections/TestimonialSection.tsx", "utf8");
const fails = [];
if (sec.includes("ScrollReelTestimonials")) fails.push("must not use ScrollReelTestimonials");
if (!sec.includes("TestimonialCarousel")) fails.push("must use TestimonialCarousel");
let car = "";
try { car = fs.readFileSync("src/components/ui/testimonial-carousel.tsx", "utf8"); } catch { fails.push("carousel file missing"); }
if (car) {
  if (!car.includes("aria-roledescription") || !car.includes("carousel")) fails.push("needs carousel semantics");
  if (!car.includes("ArrowLeft") || !car.includes("ArrowRight")) fails.push("needs arrow nav");
  if (!car.includes("onKeyDown") && !car.includes("onKey")) fails.push("needs keyboard nav");
  if (!car.includes("pause") && !car.includes("Pause") && !car.includes("paused")) fails.push("needs pause-on-hover");
  if (car.includes("...testimonials, ...testimonials, ...testimonials")) fails.push("no 5x duplication allowed");
  if (!car.includes("alt")) fails.push("images need alt");
}
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("testimonials: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-testimonials.mjs`
Expected: FAIL (still ScrollReel).

- [ ] **Step 3: Write minimal implementation**

Create `testimonial-carousel.tsx`: index state + `go(i)` clamp+wrap; autoplay `useEffect` 5000ms unless `paused || reducedMotion`; container `role="group" aria-roledescription="carousel" tabIndex={0} onKeyDown` ArrowLeft/Right/Home/End; track `motion.div animate={{ x: -index*100% }}` with `drag="x" onDragEnd` threshold 50px; slides `min-w-full` card: `next/image` 64px avatar + quote (font-display, max 3 lines) + author + role; controls: prev/next buttons (lucide ChevronLeft/Right, aria-labels) + dots (`aria-label="Go to slide N"`, `aria-current`); pause on hover/focus. No avatar rail marquee (YAGNI — hapus sumber bug; tambah lagi hanya bila owner minta).

Rewrite `TestimonialSection.tsx`: section with `id="testimoni"`, heading `font-display`, render `<TestimonialCarousel testimonials={TESTIMONIALS} />`; keep existing TESTIMONIALS array (add `role` field where known, else `"Klien Logia"`); delete scroll-reel import; remove `pointer-events-none`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-testimonials.mjs && npm run lint`
Expected: `testimonials: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/testimonial-carousel.tsx src/components/sections/TestimonialSection.tsx scripts/verify-testimonials.mjs
git rm -q src/components/ui/scroll-reel-testimonials.tsx
git commit -m "fix: fase 3b testimonial carousel tanpa duplikasi

Hapus scroll-reel 5x-dup (~210 img). Drag/auto 5s pause-hover, dots+panah,
keyboard, alt, reduced-motion off. Foto masih placeholder Unsplash.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 7: Fase 4a — Rate-card data model (verbatim §A6)

**Files:**
- Create: `src/lib/rate-card.ts`
- Test: `scripts/verify-rate-data.mjs`

**Interfaces:**
- Consumes: nothing (pure data)
- Produces: `export const PACKAGES: Package[]` (4 entries exact name/price/period/desc/features), `export const SINGLE_SERVICES: { category, items: { name, price }[] }[]` (3 categories, 18 items), `export const TERMS: { title, body[] }[]` (5 groups); types `Package, SingleItem, TermGroup`

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-rate-data.mjs
import fs from "node:fs";
const d = fs.readFileSync("src/lib/rate-card.ts", "utf8");
const must = ["Rp 350.000", "Rp 850.000", "Rp 1.500.000 / Bulan", "Mulai dari Rp 2.750.000", "Most Popular", "Rp 150.000", "Rp 35.000 / post", "Rp 500.000", "Mulai dari Rp 1.000.000", "Rp 100.000 / sesi", "DP) sebesar 50%", "Rp 50.000 / revisi", "3–7 hari kerja", "7–14 hari kerja", "minimal 3 bulan"];
const miss = must.filter((s) => !d.includes(s));
if (miss.length) { console.error("missing:\n" + miss.join("\n")); process.exit(1); }
console.log("rate-data: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-rate-data.mjs`
Expected: FAIL (file missing).

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/rate-card.ts` with exact strings: packages A–D (names `STARTER BRAND`, `DIGITAL PRESENCE`, `GROWTH PACKAGE`, `SMART BUSINESS PACKAGE`; prices as above; features arrays copied from §A6 including `GRATIS Website Company Profile (Basic) — dikerjakan di bulan pertama`); single services 3 groups with all 18 name+price pairs verbatim; terms 5 groups (Pembayaran 2 bullets, Revisi 2, Teknologi 2, Langganan 1, Waktu 2) verbatim §A6.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-rate-data.mjs`
Expected: `rate-data: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/rate-card.ts scripts/verify-rate-data.mjs
git commit -m "feat: fase 4a rate-card data verbatim A6

4 paket + 18 layanan satuan + 5 grup T&C. Nominal/frasa persis spek.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 8: Fase 4b — Rate-card UI (tabs + accordion + honest PDF)

**Files:**
- Modify: `src/components/sections/PricingSection.tsx`
- Create: `public/rate-card-coming-soon.txt` (only if PDF not ready; else place real `public/rate-card-logia.pdf`)
- Test: `scripts/verify-rate-ui.mjs`

**Interfaces:**
- Consumes: `PACKAGES, SINGLE_SERVICES, TERMS` from `@/lib/rate-card`
- Produces: `PricingSection` with tab `Paket Terintegrasi | Layanan Satuan`, package accordion (expand/collapse, Most Popular badge on Growth), grouped single-service table, T&C accordion, CTA `Pilih [Paket]` → `#kontak`, PDF button honest (real PDF link or disabled "PDF segera hadir")

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-rate-ui.mjs
import fs from "node:fs";
const p = fs.readFileSync("src/components/sections/PricingSection.tsx", "utf8");
const fails = [];
if (!p.includes("Paket Terintegrasi") || !p.includes("Layanan Satuan")) fails.push("tabs missing");
if (!p.includes("Most Popular")) fails.push("badge missing");
if (!p.includes("Syarat & Ketentuan") && !p.includes("Syarat & Ketentuan Layanan")) fails.push("T&C section missing");
if (p.includes('href="#"')) fails.push('dead href="#" forbidden');
if (!p.includes("#kontak") && !p.includes("kontak")) fails.push("package CTA must target #kontak");
if (!p.includes("accordion") && !p.includes("Accordion") && !p.includes("expanded")) fails.push("expand/collapse required");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("rate-ui: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-rate-ui.mjs`
Expected: FAIL (no tabs, has `href="#"`).

- [ ] **Step 3: Write minimal implementation**

Rewrite `PricingSection.tsx`: tab state `paket|satuan`; paket grid 4 cards from PACKAGES (price printed raw, no "Mulai" prefix logic; Growth card highlighted + badge); features list with accordion on mobile (`<details>` styled or button+AnimatePresence, `aria-expanded`); CTA `<a href="#kontak">Pilih {name}</a>`; satuan view: 3 category tables from SINGLE_SERVICES (name left, price right, hairline rows); T&C: accordion list from TERMS (`aria-expanded`, one open at a time); PDF row: if `public/rate-card-logia.pdf` exists use `<a href="/rate-card-logia.pdf" download>` else disabled button `Download Rate Card Lengkap (PDF) — segera hadir` with `aria-disabled title`. Delete old modal + old terms array + old `checkIconColor` consts. Decision default: coming-soon disabled (jujur) until owner supplies PDF — report in summary.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-rate-ui.mjs && npm run lint`
Expected: `rate-ui: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/PricingSection.tsx scripts/verify-rate-ui.mjs public/rate-card-coming-soon.txt
git commit -m "feat: fase 4b rate card tabs + accordion + T&C, PDF jujur

Asumsi: tombol PDF coming-soon disabled sampai owner kirim file asli.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 9: Fase 5 — Hero/Target/About/Services/Footer refresh (copy frozen)

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`, `src/components/sections/BackgroundTargetSection.tsx`, `src/components/sections/CompanyProfileSection.tsx`, `src/components/sections/ServicesSection.tsx`, `src/components/sections/FooterSection.tsx`, `src/app/page.tsx` (MarqueeStrip classes only)
- Test: `scripts/verify-sections.mjs`

**Interfaces:**
- Consumes: `.font-display` + bronze token + `--ease-out-expo` from Task 3
- Produces: same props/copy/CTA targets; headlines `font-display`, hairline dividers, generous whitespace; Hero keeps `Craft Your Brand Identity` + ticker + `Mulai Proyek`/`Lihat Portfolio`; Target keeps 3 tabs + stats; About keeps Visi/Misi/Filosofi sticky; Services keeps 6 items + 3D tilt wrapper; Footer keeps columns + Studio Time

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-sections.mjs
import fs from "node:fs";
const read = (f) => fs.readFileSync(f, "utf8");
const fails = [];
const hero = read("src/components/sections/HeroSection.tsx");
if (!hero.includes("Craft Your") || !hero.includes("Mulai Proyek") || !hero.includes("Lihat Portfolio")) fails.push("hero copy changed");
if (!hero.includes("font-display")) fails.push("hero must use font-display");
const tgt = read("src/components/sections/BackgroundTargetSection.tsx");
if (!tgt.includes("+300%") || !tgt.includes("UMKM")) fails.push("target copy changed");
const svc = read("src/components/sections/ServicesSection.tsx");
if ((svc.match(/title: "/g) || []).length < 6) fails.push("services must keep 6 items");
if (!svc.includes("whileHover")) fails.push("services 3D tilt must stay");
const dup = (read("src/components/sections/BackgroundTargetSection.tsx").match(/id="portfolio"/g) || []).length + (read("src/components/sections/PortfolioSection.tsx").match(/id="portfolio"/g) || []).length;
if (dup > 1) fails.push("duplicate id portfolio must be fixed (target -> id target-pasar)");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("sections: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-sections.mjs`
Expected: FAIL (no font-display, dup id).

- [ ] **Step 3: Write minimal implementation**

Per file, typography/spacing only: h1/h2 add `font-display font-medium tracking-[-0.02em]`; eyebrow add bronze `text-[var(--accent-bronze)] uppercase tracking-[0.2em]`; section wrappers add `border-t border-black/5 dark:border-white/5`; keep all copy/handlers. Fix IDs: `BackgroundTargetSection` section `id="portfolio"` → `id="target-pasar"`; ensure `HeroSection id="top"`, `CompanyProfileSection id="about"`, `ServicesSection id="layanan"`. Keep `InteractiveShape` untouched. MarqueeStrip: keep words, change container to hairline `border-y border-black/10 dark:border-white/10 bg-transparent`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-sections.mjs && npm run lint`
Expected: `sections: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroSection.tsx src/components/sections/BackgroundTargetSection.tsx src/components/sections/CompanyProfileSection.tsx src/components/sections/ServicesSection.tsx src/components/sections/FooterSection.tsx src/app/page.tsx scripts/verify-sections.mjs
git commit -m "feat: fase 5 refresh hero/target/about/services/footer luxury

Copy frozen, font-display + hairlines. Fix: id target-pasar anti-duplikat.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 10: Fase 6 — Selected Work & Archive VISUAL ONLY

**Files:**
- Modify: `src/components/sections/PortfolioSection.tsx` (classes only), `src/components/ui/hero-carousel.tsx` (classes only)
- Test: `scripts/verify-portfolio-visual.mjs`

**Interfaces:**
- Consumes: existing filter state (`activeCategory/displayedCategory`, 150ms exit), `categories`, `projects/allProjects`, `HeroCarousel` props
- Produces: identical logic/markup structure; new hover (grayscale→color, mask reveal), `font-display` header, hairline tabs, filter transitions; tilt+glare code untouched

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-portfolio-visual.mjs
import fs from "node:fs";
const p = fs.readFileSync("src/components/sections/PortfolioSection.tsx", "utf8");
const fails = [];
for (const s of ["activeCategory", "displayedCategory", "setIsExiting", "HeroCarousel", "PortfolioCard", "mouseXSpring", "Archive"]) if (!p.includes(s)) fails.push(`logic token missing: ${s}`);
if (!p.includes("grayscale") || !p.includes("font-display")) fails.push("visual treatment missing (grayscale + font-display)");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("portfolio-visual: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-portfolio-visual.mjs`
Expected: FAIL (no grayscale/font-display yet).

- [ ] **Step 3: Write minimal implementation**

Only className/style edits: header h2 add `font-display`; filter buttons hairline style keep active logic; `PortfolioCard` Image add `grayscale group-hover:grayscale-0` + `group-hover:scale-105` keep; content add hairline top border; overlay Archive header add `font-display`; `hero-carousel.tsx`: only rail/headline font classes, no prop/logic change. Do not touch `useState/useEffect/filter/go/drag/wheel` lines.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-portfolio-visual.mjs && npm run lint`
Expected: `portfolio-visual: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/PortfolioSection.tsx src/components/ui/hero-carousel.tsx scripts/verify-portfolio-visual.mjs
git commit -m "feat: fase 6 selected work + archive visual only

Grayscale-to-color hover, display type, hairlines. Filter/grid/counter logic
+ tilt/glare utuh.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 11: Fase 7 — Functionality sweep (anchors, CTAs, images, clock)

**Files:**
- Modify: `src/components/LiquidNavbar.tsx`, `src/components/CollaborationModal.tsx`, `src/components/sections/FooterSection.tsx`, any file with `<img` or placeholder social links
- Test: `scripts/verify-functional.mjs`

**Interfaces:**
- Consumes: section ids `top, about, target-pasar, layanan, portfolio, pricing, testimoni, kontak`
- Produces: navbar links `[Home #top, About #about, Services #layanan, Portfolio #portfolio, Pricing #pricing, Contact #kontak]` with 80px offset + scrollspy; all CTAs → `#kontak`/mailto/tel/WhatsApp `https://wa.me/6281234567890`; Studio Time client-only no hydration warning; all images next/image + alt; social links final or labeled

- [ ] **Step 1: Write the failing test**

```js
// scripts/verify-functional.mjs
import fs from "node:fs";
import { execSync } from "node:child_process";
const read = (f) => fs.readFileSync(f, "utf8");
const fails = [];
const nav = read("src/components/LiquidNavbar.tsx");
for (const h of ['#top', '#about', '#layanan', '#portfolio', '#pricing', '#kontak']) if (!nav.includes(h)) fails.push(`nav missing ${h}`);
const raw = execSync('grep -rn \'href="#"\' src --include="*.tsx" || true', { encoding: "utf8" }).trim();
if (raw) fails.push(`dead hrefs:\n${raw}`);
const imgs = execSync('grep -rn "<img" src --include="*.tsx" || true', { encoding: "utf8" }).trim();
if (imgs) fails.push(`raw <img>:\n${imgs}`);
const foot = read("src/components/sections/FooterSection.tsx");
if (!foot.includes("useEffect") || !foot.includes("Asia/Jakarta")) fails.push("studio time must be client effect WIB");
if (foot.includes("https://instagram.com\"") || foot.includes("https://linkedin.com\"")) fails.push("social placeholders must be final URLs or labeled");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("functional: ok");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-functional.mjs`
Expected: FAIL (nav has #home/#services/#contact, placeholder socials).

- [ ] **Step 3: Write minimal implementation**

`LiquidNavbar.tsx`: replace navLinks with 6 entries above; sectionIds `["top","about","layanan","portfolio","pricing","kontak"]`; keep 80px offset + rAF scrollspy. `FooterSection.tsx`: Eksplorasi links → `#about/#target-pasar/#portfolio/#pricing`; socials → owner URLs or keep + add `aria-label + title="segera hadir"` if unconfirmed (report assumption); Studio Time keep useEffect pattern (already safe) + initial `""` render (no hardcoded time mismatch). Package/modal CTAs: `Mulai Proyek/Konsultasikan/Pilih/Mulai Diskusi` → open modal or `#kontak`; add `https://wa.me/6281234567890` fallback in modal contact row. Replace any `<img` with `next/image`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-functional.mjs && npm run lint`
Expected: `functional: ok`.

- [ ] **Step 5: Commit**

```bash
git add src/components/LiquidNavbar.tsx src/components/CollaborationModal.tsx src/components/sections/FooterSection.tsx scripts/verify-functional.mjs
git commit -m "fix: fase 7 anchors + CTAs + images + studio time

Nav 6 anchor presisi offset 80px. Asumsi: WA 6281234567890, sosmed final
menyusul owner.
Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 12: Fase 8 — QA & acceptance (lint, build, themes, motion)

**Files:**
- Modify: none (fix-only if failures)
- Test: full gate

**Interfaces:**
- Consumes: all Tasks 1–11 output
- Produces: A8 checklist report appended to plan + zero-error `lint`/`build`

- [ ] **Step 1: Write the failing gate**

```bash
npm run lint
```

Expected: FAIL on first run if any task left warnings (fix inline, no new features).

- [ ] **Step 2: Run build gate**

```bash
npm run build
```

Expected: PASS with no errors; if fail, fix only the failing file, rerun.

- [ ] **Step 3: Manual matrix (record results in PR/commit body)**

```text
- dark + light per section: hero/target/about/services/work/archive/pricing/testimoni/CTA/footer readable, no black-on-black
- mobile 360px / tablet 768px / desktop 1440px: no overflow-x, grids collapse, ticker + carousel swipe
- prefers-reduced-motion ON: splash instant, marquee static, reveals visible, carousel autoplay off
- keyboard: tab through nav/tabs/carousel/dots/accordion, focus ring visible
- console: zero errors/warnings dev + prod
```

- [ ] **Step 4: Verify acceptance mapping**

Run: `node scripts/verify-theme.mjs && node scripts/verify-tokens.mjs && node scripts/verify-splash.mjs && node scripts/verify-cta.mjs && node scripts/verify-testimonials.mjs && node scripts/verify-rate-data.mjs && node scripts/verify-rate-ui.mjs && node scripts/verify-sections.mjs && node scripts/verify-portfolio-visual.mjs && node scripts/verify-functional.mjs`
Expected: all `ok`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: fase 8 QA gate lint+build bersih, A8 terpenuhi

Co-Authored-By: Claude Code <noreply@anthropic.com>" --allow-empty
```

## Self-Review

- Spec coverage: A5 splash Tasks 4; navbar/toggle Tasks 2/11; hero Task 9; target Task 9; about Task 9; services Task 9; selected work Task 10; archive Task 10; rate card Tasks 7-8; testimonial Task 6; CTA Task 5; footer Tasks 9/11; A6 verbatim Task 7; A7 checklist Task 11; A4 tokens/motion Tasks 3/12. No gaps.
- Placeholder scan: no TBD/TODO/dead href; coming-soon PDF is explicit disabled state with assumption flagged, not silent placeholder.
- Type consistency: `Testimonial { quote, author, role?, image, alt }`, `Package { name, price, period, badge?, desc, features[] }`, `go(i: number)` naming stable across Tasks 6/10.
- Review Focus: 5 lines above each pinned to owning task script (CTA→Task 5, theme→Task 2, anchors→Task 11, testimonial dup→Task 6, price prefix→Tasks 7-8).
