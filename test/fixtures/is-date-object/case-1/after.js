var assert = require('assert');

assert.notOk(Object.prototype.toString.call(undefined) === '[object Date]');
assert.notOk(Object.prototype.toString.call(null) === '[object Date]');
assert.notOk(Object.prototype.toString.call(false) === '[object Date]');
assert.notOk(Object.prototype.toString.call(true) === '[object Date]');
assert.notOk(Object.prototype.toString.call(42) === '[object Date]');
assert.notOk(Object.prototype.toString.call('foo') === '[object Date]');
assert.notOk(Object.prototype.toString.call(function () {}) === '[object Date]');
assert.notOk(Object.prototype.toString.call([]) === '[object Date]');
assert.notOk(Object.prototype.toString.call({}) === '[object Date]');
assert.notOk(Object.prototype.toString.call(/a/g) === '[object Date]');
assert.notOk(Object.prototype.toString.call(new RegExp('a', 'g')) === '[object Date]');

assert.ok(Object.prototype.toString.call(new Date()) === '[object Date]');
