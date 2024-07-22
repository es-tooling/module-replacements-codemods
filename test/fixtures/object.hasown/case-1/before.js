const assert = require("assert");
const hasOwn = require("object.hasown");

assert.equal(hasOwn({}, "toString"), false);
assert.equal(hasOwn([], "length"), true);
assert.equal(hasOwn({ a: 42 }, "a"), true);
