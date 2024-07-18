var slice = require('array.prototype.slice');
var assert = require('assert');

var a = [1, 2, 3];
assert.deepEqual(slice(a, 1, 2), [2]);
assert.deepEqual(slice(a, -2), [2, 3]);
