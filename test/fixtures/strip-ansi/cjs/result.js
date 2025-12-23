const { stripVTControlCharacters } = require('node:util');

const text = '\u001B[4mformatted text\u001B[0m';
const clean = stripVTControlCharacters(text);

console.log(stripVTControlCharacters('\u001B[31mred text\u001B[0m'));
