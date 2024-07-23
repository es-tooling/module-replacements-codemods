var banana = require("array-includes");
var assert = require("assert");
var arr = ["one", "two"];

var arr = [1, "foo", NaN, -0];

assert.equal(banana(arr, 0), true);
assert.equal(banana(arr, -0), true);

assert.equal(banana(arr, NaN), true);

assert.equal(banana(arr, "foo", 0), true);
assert.equal(banana(arr, "foo", 1), true);
assert.equal(banana(arr, "foo", 2), false);
