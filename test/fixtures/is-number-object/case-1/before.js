var isNumber = require('is-number-object');
var assert = require('assert');

assert.notOk(isNumber(undefined));
assert.notOk(isNumber(null));
assert.notOk(isNumber(false));
assert.notOk(isNumber(true));
assert.notOk(isNumber('foo'));
assert.notOk(isNumber(function () {}));
assert.notOk(isNumber([]));
assert.notOk(isNumber({}));
assert.notOk(isNumber(/a/g));
assert.notOk(isNumber(new RegExp('a', 'g')));
assert.notOk(isNumber(new Date()));

assert.ok(isNumber(42));
assert.ok(isNumber(NaN));
assert.ok(isNumber(Infinity));
assert.ok(isNumber(new Number(42)));
