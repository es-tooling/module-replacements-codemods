
var assert = require("assert");

function fn() {}
Object.defineProperty(fn, 'name', { value: "myFunc", configurable: true });

assert.equal(fn.name, "myFunc");
