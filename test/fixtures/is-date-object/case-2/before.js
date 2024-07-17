import assert from 'assert';
import isDate from 'is-date-object';

assert.notOk(isDate(undefined));
assert.notOk(isDate(null));
assert.notOk(isDate(false));
assert.notOk(isDate(true));
assert.notOk(isDate(42));
assert.notOk(isDate('foo'));
assert.notOk(isDate(function () {}));
assert.notOk(isDate([]));
assert.notOk(isDate({}));
assert.notOk(isDate(/a/g));
assert.notOk(isDate(new RegExp('a', 'g')));

assert.ok(isDate(new Date()));
