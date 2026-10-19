const m = require('./lighthouse-mobile.json');
const str = JSON.stringify(m.audits);
console.log('Contains is-audit:', str.includes('is-audit'));
const d = require('./lighthouse-desktop.json');
const dstr = JSON.stringify(d.audits);
console.log('Desktop contains is-audit:', dstr.includes('is-audit'));
