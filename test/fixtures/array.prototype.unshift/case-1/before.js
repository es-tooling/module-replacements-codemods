var unshift = require('array.prototype.unshift');
var assert = require('assert');

var a = [1, 1, 1];
assert.deepEqual(unshift(a, 1, 2), 5);
assert.deepEqual(a, [1, 2, 1, 1, 1]);
