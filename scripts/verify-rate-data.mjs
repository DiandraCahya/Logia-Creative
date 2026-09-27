import fs from "node:fs";
const d = fs.readFileSync("src/lib/rate-card.ts", "utf8");
const must = ["Rp 350.000", "Rp 850.000", "Rp 1.500.000 / Bulan", "Mulai dari Rp 2.750.000", "Most Popular", "Rp 150.000", "Rp 35.000 / post", "Rp 500.000", "Mulai dari Rp 1.000.000", "Rp 100.000 / sesi", "DP) sebesar 50%", "Rp 50.000 / revisi", "3–7 hari kerja", "7–14 hari kerja", "minimal 3 bulan"];
const miss = must.filter((s) => !d.includes(s));
if (miss.length) { console.error("missing:\n" + miss.join("\n")); process.exit(1); }
console.log("rate-data: ok");
