var splice = require('array.prototype.splice');
var assert = require('assert');

var a = [1, 1, 1];
assert.deepEqual(splice(a, 1, 2), [1, 1]);
assert.deepEqual(a, [1]);
