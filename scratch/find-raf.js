const fs = require('fs');
const lines = fs.readFileSync('lh-test-0.trace.json', 'utf8').split('\n');

const rafEvents = [];
for (const line of lines) {
  if (!line.includes('"name":"AnimationFrame"') && !line.includes('"name":"FireAnimationFrame"') && !line.includes('"name":"RequestAnimationFrame"')) continue;
  try {
    const cleaned = line.trim().replace(/^,|,$/g, '');
    const ev = JSON.parse(cleaned);
    rafEvents.push(ev);
    if (rafEvents.length >= 10) break;
  } catch (e) {}
}

console.log('Sample RAF events:');
console.log(JSON.stringify(rafEvents.slice(0, 5), null, 2));
