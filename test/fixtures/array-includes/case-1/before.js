var includes = require("array-includes");
var assert = require("assert");
var arr = ["one", "two"];

var arr = [1, "foo", NaN, -0];

assert.equal(includes(arr, 0), true);
assert.equal(includes(arr, -0), true);

assert.equal(includes(arr, NaN), true);

assert.equal(includes(arr, "foo", 0), true);
assert.equal(includes(arr, "foo", 1), true);
assert.equal(includes(arr, "foo", 2), false);
