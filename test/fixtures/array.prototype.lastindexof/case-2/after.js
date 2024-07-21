var assert = require('assert');

assert.equal([1, 2, 3].lastIndexOf(2), 1);
assert.equal([1, 0, 1].lastIndexOf(1), 2);
assert.equal([1, 2, 3].lastIndexOf(4), -1);
assert.equal([NaN].lastIndexOf(NaN), -1);
