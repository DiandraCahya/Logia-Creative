import fs from "node:fs";
const f = fs.readFileSync("src/components/sections/FooterSection.tsx", "utf8");
const c = fs.readFileSync("src/app/globals.css", "utf8");
const fails = [];
if (!f.includes("cta-dark")) fails.push("banner must carry cta-dark scope class");
if (!c.includes(".cta-dark")) fails.push("css must scope cta-dark exceptions");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("cta: ok");
