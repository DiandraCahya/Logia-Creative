const fs = require('fs');
const lines = fs.readFileSync('lh-test-0.trace.json', 'utf8').split('\n');
for (const line of lines) {
  if (line.includes('"nodeId":13') || line.includes('"nodeId": 13')) {
    console.log(line);
    break;
  }
}
