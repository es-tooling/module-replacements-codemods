const assert = require("assert");
const hasOwnProperty = require("has-own-prop");

assert.equal(hasOwnProperty({}, "toString"), false);
assert.equal(hasOwnProperty([], "length"), true);
assert.equal(hasOwnProperty({ a: 42 }, "a"), true);
