var assert = require('assert');

assert.notOk(Object.prototype.toString.call(undefined) === '[object String]');
assert.notOk(Object.prototype.toString.call(null) === '[object String]');
assert.notOk(Object.prototype.toString.call(false) === '[object String]');
assert.notOk(Object.prototype.toString.call(true) === '[object String]');
assert.notOk(Object.prototype.toString.call(function () {}) === '[object String]');
assert.notOk(Object.prototype.toString.call([]) === '[object String]');
assert.notOk(Object.prototype.toString.call({}) === '[object String]');
assert.notOk(Object.prototype.toString.call(/a/g) === '[object String]');
assert.notOk(Object.prototype.toString.call(new RegExp('a', 'g')) === '[object String]');
assert.notOk(Object.prototype.toString.call(new Date()) === '[object String]');
assert.notOk(Object.prototype.toString.call(42) === '[object String]');
assert.notOk(Object.prototype.toString.call(NaN) === '[object String]');
assert.notOk(Object.prototype.toString.call(Infinity) === '[object String]');
assert.notOk(Object.prototype.toString.call(new Number(42)) === '[object String]');

assert.ok(Object.prototype.toString.call('foo') === '[object String]');
assert.ok(Object.prototype.toString.call(Object('foo')) === '[object String]');
