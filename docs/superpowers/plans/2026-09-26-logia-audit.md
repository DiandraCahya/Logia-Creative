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
