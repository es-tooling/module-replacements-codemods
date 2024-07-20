var assert = require("assert");

var arr = [0, 1, 2, 3, 4, 5];

var results = arr.toReversed();

assert.deepEqual(results, [5, 4, 3, 2, 1, 0]);
assert.deepEqual(arr, [0, 1, 2, 3, 4, 5]);
