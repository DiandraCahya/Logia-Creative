const { execFileSync } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const html = execFileSync(chromePath, ['--headless', '--dump-dom', 'http://localhost:3000']).toString();
const m = html.match(/<html[^>]*>/);
console.log('Headless Chrome HTML tag:', m ? m[0] : 'None');
