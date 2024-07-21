var assert = require('assert');

assert.ok(isPrimitive(undefined));
assert.ok(isPrimitive(null));
assert.ok(isPrimitive(false));
assert.ok(isPrimitive(true));
assert.notOk(isPrimitive(function () { }));
assert.notOk(isPrimitive([]));
assert.notOk(isPrimitive({}));
assert.notOk(isPrimitive(/a/g));
assert.notOk(isPrimitive(new RegExp('a', 'g')));
assert.notOk(isPrimitive(new Date()));
assert.ok(isPrimitive(42));
assert.ok(isPrimitive(NaN));
assert.ok(isPrimitive(Infinity));
assert.ok(isPrimitive(new Number(42)));
assert.ok(isPrimitive('foo'));
assert.notOk(isPrimitive(Object('foo')));

function isPrimitive(val) {
  if (typeof val === 'object') {
    return val === null;
  }

  return typeof val !== 'function';
}
