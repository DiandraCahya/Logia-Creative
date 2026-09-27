import fs from "node:fs";
import { execSync } from "node:child_process";
const read = (f) => fs.readFileSync(f, "utf8");
const fails = [];
const nav = read("src/components/LiquidNavbar.tsx");
for (const h of ["#top", "#about", "#layanan", "#portfolio", "#pricing", "#kontak"]) {
  if (!nav.includes(h)) fails.push(`nav missing ${h}`);
}
const raw = execSync('grep -rn \'href="#"\' src --include="*.tsx" || true', { encoding: "utf8" }).trim();
if (raw) fails.push(`dead hrefs:\n${raw}`);
const imgs = execSync('grep -rn "<img" src --include="*.tsx" || true', { encoding: "utf8" }).trim();
if (imgs) fails.push(`raw <img>:\n${imgs}`);
const foot = read("src/components/sections/FooterSection.tsx");
if (!foot.includes("useEffect") || !foot.includes("Asia/Jakarta")) fails.push("studio time must be client effect WIB");
if (foot.includes('href="https://instagram.com"') || foot.includes('href="https://linkedin.com"')) fails.push("social placeholders must be final URLs or labeled");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("functional: ok");
