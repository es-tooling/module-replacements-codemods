var fround = require("math.fround/polyfill");
var assert = require("assert");

assert.equal(fround(1.5), 1.5);
assert.equal(fround(2 ** 150), Infinity);
