import assert from 'assert';

assert.notOk(Object.prototype.toString.call(undefined) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(null) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call('foo') === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(function () {}) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call([]) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call({}) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(/a/g) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(new RegExp('a', 'g')) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(new Date()) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(42) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(NaN) === '[object Boolean]');
assert.notOk(Object.prototype.toString.call(Infinity) === '[object Boolean]');

assert.ok(Object.prototype.toString.call(new Boolean(42)) === '[object Boolean]');
assert.ok(Object.prototype.toString.call(false) === '[object Boolean]');
assert.ok(Object.prototype.toString.call(Object(false)) === '[object Boolean]');
assert.ok(Object.prototype.toString.call(true) === '[object Boolean]');
assert.ok(Object.prototype.toString.call(Object(true)) === '[object Boolean]');
