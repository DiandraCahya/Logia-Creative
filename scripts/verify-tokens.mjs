import fs from "node:fs";
const l = fs.readFileSync("src/app/layout.tsx", "utf8");
const c = fs.readFileSync("src/app/globals.css", "utf8");
const fails = [];
// Ruling (Task 12): desain final memakai SATU font sans (Inter) sebagai substitusi
// "Anthropic Sans"; serif display (Fraunces) sengaja DIBUANG (lihat komit
// "ponytail: single sans everywhere"). `--font-display` tetap ada sebagai alias
// `var(--font-sans)`. Gate = Inter dimuat + token display/aksen/easing tersedia.
if (!l.includes("Inter")) fails.push("layout must load Inter via next/font");
if (!l.includes("--font-inter") && !l.includes("--font-sans")) fails.push("layout must expose a font CSS variable");
if (!c.includes("--font-display") || !c.includes("--accent-bronze") || !c.includes("--ease-out-expo")) fails.push("tokens missing");
if (!c.includes("#FAFAF8") || !c.includes("#0A0A0A")) fails.push("near-white/near-black tokens missing");
if (c.includes("html:not(.dark) h1,") && !c.includes(".cta-dark")) fails.push("light h-override must exclude .cta-dark scope");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("tokens: ok");
