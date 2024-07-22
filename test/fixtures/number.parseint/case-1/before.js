const assert = require("assert");

assert.equal(Number.parseInt("-3"), -3); // -3
assert.equal(Number.parseInt("0x10"), 16); // 16
assert.equal(Number.parseInt("30", 7), 21); // 21
assert.equal(Number.parseInt("ef"), Number.NaN); // NaN
