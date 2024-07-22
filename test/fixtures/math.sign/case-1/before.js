var sign = require("math.sign/polyfill");
var assert = require("assert");

assert.equal(sign(3), 1);
assert.equal(sign(-3), -1);
