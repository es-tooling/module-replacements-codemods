import banana from 'array.prototype.lastindexof';
var assert = require('assert');

assert.equal(banana([1, 2, 3], 2), 1);
assert.equal(banana([1, 0, 1], 1), 2);
assert.equal(banana([1, 2, 3], 4), -1);
assert.equal(banana([NaN], NaN), -1);
