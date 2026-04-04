const fs = require('fs');
const content = fs.readFileSync('app/reports/page.tsx', 'utf8');
const lines = content.split('\n');
console.log('Line 1308:', JSON.stringify(lines[1307]));
console.log('Line 1536:', JSON.stringify(lines[1535]));
console.log('Line 2013:', JSON.stringify(lines[2012]));
