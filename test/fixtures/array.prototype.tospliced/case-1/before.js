var toSpliced = require("array.prototype.tospliced");
var assert = require("assert");

var input = [5, 4, 3, 2, 1, 0];

var output = toSpliced(input, 2, 2);

assert.notEqual(output, input);
assert.deepEqual(output, [5, 4, 1, 0]);
assert.deepEqual(input, [5, 4, 3, 2, 1, 0]);
