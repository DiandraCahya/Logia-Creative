const fs = require('fs');
const lines = fs.readFileSync('lh-test-0.trace.json', 'utf8').split('\n');
const navStart = 351762679789;
const events = [];

for (const line of lines) {
  if (!line.includes('"name":')) continue;
  try {
    const cleaned = line.trim().replace(/^,|,$/g, '');
    const ev = JSON.parse(cleaned);
    if (!ev.ts) continue;
    const relMs = (ev.ts - navStart) / 1000;
    if (relMs < 0 || relMs > 1200) continue;
    if (ev.name.includes('Largest') || ev.name.includes('Animation') || ev.name.includes('Layout') || ev.name === 'Paint') {
      events.push({
        name: ev.name,
        relMs: Math.round(relMs),
        node: ev.args?.data?.nodeName || ev.args?.data?.displayName || ''
      });
    }
  } catch (e) {}
}

console.log('Found', events.length, 'events:');
console.log(events.filter(e => e.name.includes('Largest') || e.name.includes('Animation') || e.node.includes('animate')));
