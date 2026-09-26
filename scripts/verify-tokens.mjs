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
