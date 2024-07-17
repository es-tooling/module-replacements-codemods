import assert from 'assert';

assert.notOk(Object.prototype.toString.call(undefined) === '[object Number]');
assert.notOk(Object.prototype.toString.call(null) === '[object Number]');
assert.notOk(Object.prototype.toString.call(false) === '[object Number]');
assert.notOk(Object.prototype.toString.call(true) === '[object Number]');
assert.notOk(Object.prototype.toString.call('foo') === '[object Number]');
assert.notOk(Object.prototype.toString.call(function () {}) === '[object Number]');
assert.notOk(Object.prototype.toString.call([]) === '[object Number]');
assert.notOk(Object.prototype.toString.call({}) === '[object Number]');
assert.notOk(Object.prototype.toString.call(/a/g) === '[object Number]');
assert.notOk(Object.prototype.toString.call(new RegExp('a', 'g')) === '[object Number]');
assert.notOk(Object.prototype.toString.call(new Date()) === '[object Number]');

assert.ok(Object.prototype.toString.call(42) === '[object Number]');
assert.ok(Object.prototype.toString.call(NaN) === '[object Number]');
assert.ok(Object.prototype.toString.call(Infinity) === '[object Number]');
assert.ok(Object.prototype.toString.call(new Number(42)) === '[object Number]');
