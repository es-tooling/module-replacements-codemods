require("number.isfinite");

const assert = require("assert");

assert.ok(Number.isFinite(3)); // true
assert.notOk(Number.isFinite(Infinity)); // false
assert.notOk(Number.isFinite("7")); // false
