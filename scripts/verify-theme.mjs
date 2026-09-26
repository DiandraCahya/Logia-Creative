import fs from "node:fs";
const t = fs.readFileSync("src/components/ThemeToggle.tsx", "utf8");
const p = fs.readFileSync("src/components/ThemeProvider.tsx", "utf8");
const l = fs.readFileSync("src/app/layout.tsx", "utf8");
const fails = [];
if (t.includes("useState(true)") || t.includes("setIsDark")) fails.push("toggle still uses local useState");
if (!t.includes("useTheme") || !t.includes("mounted")) fails.push("toggle must use useTheme + mounted guard");
if (t.includes("☀️") || t.includes("🌙")) fails.push("emoji toggle forbidden, use lucide Sun/Moon");
if (!p.includes('defaultTheme="system"') || !p.includes("enableSystem")) fails.push("provider must default system + enableSystem");
if (l.includes('defaultTheme="dark"')) fails.push("layout still forces default dark");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("theme: ok");
