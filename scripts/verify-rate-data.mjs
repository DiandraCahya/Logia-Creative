import fs from "node:fs";
const d = fs.readFileSync("src/lib/rate-card.ts", "utf8");
const must = [
  "START_FROM_LABEL",
  'START_FROM_LABEL = "Start From"',
  "Technology Solution",
  "Creative Solution",
  "Integrated Solution",
  "WEB STARTER",
  "WEB APP & SYSTEM",
  "SMART AUTOMATION",
  "BRAND STARTER",
  "VISUAL CAMPAIGN",
  "CREATIVE GROWTH",
  "DIGITAL PRESENCE",
  "BUSINESS LAUNCHPAD",
  "ULTIMATE PARTNER",
  "250000",
  "700000",
  "1500000",
  "150000",
  "350000",
  "500000",
  "1200000",
  "Project-Based",
  "Langganan Bulanan",
  "Rp 50.000 / revisi",
  "3–7 hari kerja",
  "7–14 hari kerja",
];
const miss = must.filter((s) => !d.includes(s));
if (miss.length) { console.error("missing:\n" + miss.join("\n")); process.exit(1); }

const banned = ["STARTER BRAND", "GROWTH PACKAGE", "SMART BUSINESS", "850.000", "2.750.000", "Retainer", "minimal 3 bulan", "Paket Terintegrasi", "Layanan Satuan"];
const hit = banned.filter((s) => d.includes(s));
if (hit.length) { console.error("banned still present:\n" + hit.join("\n")); process.exit(1); }
console.log("rate-data: ok");