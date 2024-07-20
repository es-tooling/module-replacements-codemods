var indexOf = require("index-of");
var assert = require("assert");

assert.equal(indexOf([1, 2, 3], 2), 1);
assert.equal(indexOf([1, 0, 1], 1), 0);
assert.equal(indexOf([1, 2, 3], 4), -1);
assert.equal(indexOf([NaN], NaN), -1);
