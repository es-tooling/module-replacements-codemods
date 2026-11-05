import { relative } from 'node:path';

console.log(!relative(process.cwd(), process.cwd()));
console.log(!relative('foo', process.cwd()));
