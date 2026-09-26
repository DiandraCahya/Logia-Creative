import fs from "node:fs";
import path from "node:path";
const root = path.join(process.cwd(), "src");
const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|css)$/.test(e.name)) files.push(p);
  }
};
walk(root);
const all = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
const checks = [
  ["CTA override", all.includes("html:not(.dark) h2")],
  ["testimonial dup", all.includes("col1 = ") && all.includes("...testimonials")],
  ["toggle local state", all.includes("setIsDark")],
  ["dead href", all.includes('href="#"')],
  ["dup id portfolio", (all.match(/id="portfolio"/g) || []).length >= 2],
];
let fail = 0;
for (const [n, ok] of checks) { console.log(`${ok ? "FOUND" : "MISS"}: ${n}`); if (!ok) fail++; }
if (fail) { console.error(`${fail} root causes unproven`); process.exit(1); }
console.log("audit: 5/5 proven");
