var assert = require("assert");
var arr = ["one", "two"];

var arr = [1, "foo", NaN, -0];

assert.equal(arr.includes(0), true);
assert.equal(arr.includes(-0), true);

assert.equal(arr.includes(NaN), true);

assert.equal(arr.includes("foo", 0), true);
assert.equal(arr.includes("foo", 1), true);
assert.equal(arr.includes("foo", 2), false);
