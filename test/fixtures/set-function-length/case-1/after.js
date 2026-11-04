
var assert = require("assert");

function fn(a, b) {}
Object.defineProperty(fn, 'length', { value: 5, configurable: true });

assert.equal(fn.length, 5);
