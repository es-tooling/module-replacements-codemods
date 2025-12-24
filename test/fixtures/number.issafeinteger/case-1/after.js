const assert = require("assert");

assert.ok(Number.isSafeInteger(-3)); // true
assert.notOk(Number.isSafeInteger(2 ** 53)); // false
assert.ok(Number.isSafeInteger(2 ** 53 - 1)); // true
assert.notOk(Number.isSafeInteger("7")); // false
