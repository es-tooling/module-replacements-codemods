var lastIndexOf = require('array.prototype.lastindexof');
var assert = require('assert');

assert.equal(lastIndexOf([1, 2, 3], 2), 1);
assert.equal(lastIndexOf([1, 0, 1], 1), 2);
assert.equal(lastIndexOf([1, 2, 3], 4), -1);
assert.equal(lastIndexOf([NaN], NaN), -1);
