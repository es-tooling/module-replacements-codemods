const assert = require("assert");

assert.equal(Object.hasOwn({}, "toString"), false);
assert.equal(Object.hasOwn([], "length"), true);
assert.equal(Object.hasOwn({ a: 42 }, "a"), true);
