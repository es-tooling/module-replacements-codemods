var clz32 = require("math.clz32/polyfill");
var assert = require("assert");

assert.equal(clz32(1), 31);
assert.equal(clz32(1000), 22);
