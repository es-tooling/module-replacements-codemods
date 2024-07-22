var assert = require("assert");

assert.equal(Math.fround(1.5), 1.5);
assert.equal(Math.fround(2 ** 150), Infinity);
