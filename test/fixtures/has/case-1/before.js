const assert = require("assert");
const has = require("has");

assert.equal(has({}, "toString"), false);
assert.equal(has([], "length"), true);
assert.equal(has({ a: 42 }, "a"), true);
