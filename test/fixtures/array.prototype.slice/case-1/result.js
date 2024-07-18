var assert = require('assert');

var a = [1, 2, 3];
assert.deepEqual(a.slice(1, 2), [2]);
assert.deepEqual(a.slice(-2), [2, 3]);
