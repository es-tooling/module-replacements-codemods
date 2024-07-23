var banana = require('is-number-object');
var assert = require('assert');

assert.notOk(banana(undefined));
assert.notOk(banana(null));
assert.notOk(banana(false));
assert.notOk(banana(true));
assert.notOk(banana('foo'));
assert.notOk(banana(function () {}));
assert.notOk(banana([]));
assert.notOk(banana({}));
assert.notOk(banana(/a/g));
assert.notOk(banana(new RegExp('a', 'g')));
assert.notOk(banana(new Date()));

assert.ok(banana(42));
assert.ok(banana(NaN));
assert.ok(banana(Infinity));
assert.ok(banana(new Number(42)));
