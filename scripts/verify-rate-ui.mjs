import fs from "node:fs";
const p = fs.readFileSync("src/components/sections/PricingSection.tsx", "utf8");
const fails = [];
// Tabs dirender dari data, bukan literal — cek pemakaian SOLUTIONS + a11y tab.
if (!p.includes("SOLUTIONS")) fails.push("tabs must render from SOLUTIONS");
if (!p.includes('role="tablist"') || !p.includes('role="tab"')) fails.push("tab a11y roles missing");
// Badge popular tetap ada (kondisional; default false di data).
if (!p.includes("Most Popular")) fails.push("badge missing");
if (!p.includes("Syarat & Ketentuan")) fails.push("T&C section missing");
if (p.includes('href="#"')) fails.push('dead href="#" forbidden');
if (!p.includes("#kontak")) fails.push("package CTA must target #kontak");
if (!p.includes("expanded")) fails.push("expand/collapse required");
if (!p.includes("AnimatePresence")) fails.push("accordion animation missing");
// Ban lama tidak boleh muncul di UI.
for (const s of ["Paket Terintegrasi", "Layanan Satuan", "STARTER BRAND", "GROWTH PACKAGE", "SMART BUSINESS", "850.000", "2.750.000", "minimal 3 bulan"]) {
  if (p.includes(s)) fails.push(`banned string in UI: ${s}`);
}
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("rate-ui: ok");