import fs from "node:fs";
const s = fs.readFileSync("src/components/SplashScreen.tsx", "utf8");
const fails = [];
if (s.includes("2700")) fails.push("dismiss must be <=2000ms");
if (!s.includes("prefers-reduced-motion") && !s.includes("matchMedia")) fails.push("must respect reduced-motion");
if (!s.includes("Skip")) fails.push("skip button required");
if (s.includes("bg-black text-white") && !s.includes("dark:")) fails.push("splash must be theme-aware, not hardcoded black-only");
if (!s.includes("progress") && !s.includes("Progress")) fails.push("thin progress indicator required");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("splash: ok");
