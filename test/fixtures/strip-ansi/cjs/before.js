const stripAnsi = require('strip-ansi');

const text = '\u001B[4mformatted text\u001B[0m';
const clean = stripAnsi(text);

console.log(stripAnsi('\u001B[31mred text\u001B[0m'));
