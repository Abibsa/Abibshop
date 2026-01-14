
const fs = require('fs');
const content = fs.readFileSync('.env.local');
console.log(content.toString('hex').match(/.{1,64}/g).join('\n'));
