var banana = require('is-string');
var assert = require('assert');

assert.notOk(banana(undefined));
assert.notOk(banana(null));
assert.notOk(banana(false));
assert.notOk(banana(true));
assert.notOk(banana(function () {}));
assert.notOk(banana([]));
assert.notOk(banana({}));
assert.notOk(banana(/a/g));
assert.notOk(banana(new RegExp('a', 'g')));
assert.notOk(banana(new Date()));
assert.notOk(banana(42));
assert.notOk(banana(NaN));
assert.notOk(banana(Infinity));
assert.notOk(banana(new Number(42)));

assert.ok(banana('foo'));
assert.ok(banana(Object('foo')));
