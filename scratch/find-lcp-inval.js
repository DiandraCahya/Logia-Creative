const fs = require('fs');
const lines = fs.readFileSync('lh-test-0.trace.json', 'utf8').split('\n');
const navStart = 351762679789;

const matches = [];
for (const line of lines) {
  try {
    const cleaned = line.trim().replace(/^,|,$/g, '');
    const ev = JSON.parse(cleaned);
    if (!ev.ts) continue;
    const relMs = (ev.ts - navStart) / 1000;
    if (relMs >= 260 && relMs <= 900) {
      if (ev.name.includes('Largest') || ev.name.includes('Invalidate') || ev.name.includes('Candidate') || ev.name === 'LayoutShift' || ev.name === 'Paint' || ev.name === 'Commit') {
        matches.push({
          relMs: Math.round(relMs),
          name: ev.name,
          cat: ev.cat,
          args: ev.args
        });
      }
    }
  } catch (e) {}
}

console.log('Matches count:', matches.length);
matches.forEach(m => console.log(m.relMs, m.name, JSON.stringify(m.args?.data || {}).slice(0, 120)));
