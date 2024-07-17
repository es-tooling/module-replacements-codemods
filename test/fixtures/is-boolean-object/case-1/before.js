var assert = require('assert');
var isBoolean = require('is-boolean-object');

assert.notOk(isBoolean(undefined));
assert.notOk(isBoolean(null));
assert.notOk(isBoolean('foo'));
assert.notOk(isBoolean(function () {}));
assert.notOk(isBoolean([]));
assert.notOk(isBoolean({}));
assert.notOk(isBoolean(/a/g));
assert.notOk(isBoolean(new RegExp('a', 'g')));
assert.notOk(isBoolean(new Date()));
assert.notOk(isBoolean(42));
assert.notOk(isBoolean(NaN));
assert.notOk(isBoolean(Infinity));

assert.ok(isBoolean(new Boolean(42)));
assert.ok(isBoolean(false));
assert.ok(isBoolean(Object(false)));
assert.ok(isBoolean(true));
assert.ok(isBoolean(Object(true)));
