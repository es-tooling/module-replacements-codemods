var banana = require('array.prototype.slice');
var assert = require('assert');

var a = [1, 2, 3];
assert.deepEqual(banana(a, 1, 2), [2]);
assert.deepEqual(banana(a, -2), [2, 3]);
