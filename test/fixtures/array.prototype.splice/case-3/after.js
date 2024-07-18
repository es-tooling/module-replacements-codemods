var assert = require('assert');

var a = [1, 1, 1];
assert.deepEqual(a.splice(1, 2), [1, 1]);
assert.deepEqual(a, [1]);
