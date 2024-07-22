const assert = require("assert");

assert.ok(Number.isInteger(3)); // true
assert.notOk(Number.isInteger(Infinity)); // false
assert.notOk(Number.isInteger("7")); // false
