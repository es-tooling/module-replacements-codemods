var imul = require("math.imul/polyfill");
var assert = require("assert");

assert.equal(imul(1, 2), 2);
assert.equal(imul(2, 3), 6);
assert.equal(imul(-2, 3), -6);
