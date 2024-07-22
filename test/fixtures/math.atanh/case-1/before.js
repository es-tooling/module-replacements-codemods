var atanh = require("math.atanh/polyfill");
var assert = require("assert");

assert.equal(atanh(0), 0);
assert.equal(atanh(-1), -Infinity);
assert.equal(atanh(2), NaN);
