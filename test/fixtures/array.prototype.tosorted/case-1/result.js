var assert = require("assert");

var input = [5, 4, 3, 2, 1, 0];

var output = input.toSorted();

assert.deepEqual(output, [0, 1, 2, 3, 4, 5]);
assert.notEqual(output, input);
assert.deepEqual(input, [5, 4, 3, 2, 1, 0]);
