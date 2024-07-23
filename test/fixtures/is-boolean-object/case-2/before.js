import assert from 'assert';
import banana from 'is-boolean-object';

assert.notOk(banana(undefined));
assert.notOk(banana(null));
assert.notOk(banana('foo'));
assert.notOk(banana(function () {}));
assert.notOk(banana([]));
assert.notOk(banana({}));
assert.notOk(banana(/a/g));
assert.notOk(banana(new RegExp('a', 'g')));
assert.notOk(banana(new Date()));
assert.notOk(banana(42));
assert.notOk(banana(NaN));
assert.notOk(banana(Infinity));

assert.ok(banana(new Boolean(42)));
assert.ok(banana(false));
assert.ok(banana(Object(false)));
assert.ok(banana(true));
assert.ok(banana(Object(true)));
