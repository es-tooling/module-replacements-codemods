var isString = require('is-string');
var assert = require('assert');

assert.notOk(isString(undefined));
assert.notOk(isString(null));
assert.notOk(isString(false));
assert.notOk(isString(true));
assert.notOk(isString(function () {}));
assert.notOk(isString([]));
assert.notOk(isString({}));
assert.notOk(isString(/a/g));
assert.notOk(isString(new RegExp('a', 'g')));
assert.notOk(isString(new Date()));
assert.notOk(isString(42));
assert.notOk(isString(NaN));
assert.notOk(isString(Infinity));
assert.notOk(isString(new Number(42)));

assert.ok(isString('foo'));
assert.ok(isString(Object('foo')));
