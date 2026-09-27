import fs from "node:fs";
const p = fs.readFileSync("src/components/sections/PortfolioSection.tsx", "utf8");
const fails = [];
for (const s of ["activeCategory", "displayedCategory", "setIsExiting", "HeroCarousel", "PortfolioCard", "mouseXSpring", "Archive"]) {
  if (!p.includes(s)) fails.push(`logic token missing: ${s}`);
}
if (!p.includes("grayscale") || !p.includes("font-display")) fails.push("visual treatment missing (grayscale + font-display)");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("portfolio-visual: ok");
