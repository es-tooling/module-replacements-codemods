var log1p = require("math.log1p/polyfill");
var assert = require("assert");

assert.equal(log1p(0.007), 0.006975613736425242);
assert.equal(log1p(6.3890560989306495), 2);
