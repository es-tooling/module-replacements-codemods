var copyWithin = require('array.prototype.copywithin');
var assert = require('assert');

var arr = [1, 2, 3, 4, 5];
assert.deepEqual(copyWithin(arr, 0, 3), [4, 5, 3, 4, 5]);
assert.deepEqual(arr, [4, 5, 3, 4, 5]);
