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
const dup =
  (read("src/components/sections/BackgroundTargetSection.tsx").match(/id="portfolio"/g) || []).length +
  (read("src/components/sections/PortfolioSection.tsx").match(/id="portfolio"/g) || []).length;
if (dup > 1) fails.push("duplicate id portfolio must be fixed (target -> id target-pasar)");
const about = read("src/components/sections/CompanyProfileSection.tsx");
if (!about.includes("font-display")) fails.push("about must use font-display");
if (!about.includes("id=\"about\"")) fails.push("about must keep id=about");
const foot = read("src/components/sections/FooterSection.tsx");
if (!foot.includes("font-display")) fails.push("footer must use font-display");
if (!foot.includes("id=\"kontak\"")) fails.push("footer must keep id=kontak");
if (!foot.includes("Studio Time")) fails.push("footer must keep Studio Time");
const page = read("src/app/page.tsx");
if (page.includes("MarqueeStrip") || page.includes("animations/Marquee")) fails.push("marquee must be removed from page");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("sections: ok");
