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
