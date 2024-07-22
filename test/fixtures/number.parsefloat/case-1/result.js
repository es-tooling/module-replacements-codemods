const assert = require("assert");

assert.equal(Number.parseFloat("-3"), -3); // -3
assert.equal(Number.parseFloat("0.43"), 0.43); // 0.43
assert.equal(Number.parseFloat("test"), Number.NaN); // NaN
