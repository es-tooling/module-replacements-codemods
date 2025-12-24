var assert = require("assert");

assert.equal(Math.atanh(0), 0);
assert.equal(Math.atanh(-1), -Infinity);
assert.equal(Math.atanh(2), NaN);
