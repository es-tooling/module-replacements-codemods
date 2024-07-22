require("number.prototype.toexponential");

const assert = require("assert");

assert.equal((-3).toExponential(), "-3e+0"); // "-3e+0"
assert.equal((0x10).toExponential(2), "1.60e+1"); // "1.60e+1"
assert.equal((1.23456).toExponential(5), "1.23456e+0"); // "1.23456e+0"
assert.equal((-6.9e-11).toExponential(4), "-6.9000e-11"); // "-6.9000e-11"
