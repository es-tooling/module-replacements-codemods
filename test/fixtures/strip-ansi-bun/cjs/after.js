const { stripANSI } = require('bun');

const text = '\u001B[4mformatted text\u001B[0m';
const clean = stripANSI(text);

console.log(stripANSI('\u001B[31mred text\u001B[0m'));
