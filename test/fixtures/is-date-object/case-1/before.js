var assert = require('assert');
var banana = require('is-date-object');

assert.notOk(banana(undefined));
assert.notOk(banana(null));
assert.notOk(banana(false));
assert.notOk(banana(true));
assert.notOk(banana(42));
assert.notOk(banana('foo'));
assert.notOk(banana(function () {}));
assert.notOk(banana([]));
assert.notOk(banana({}));
assert.notOk(banana(/a/g));
assert.notOk(banana(new RegExp('a', 'g')));

assert.ok(banana(new Date()));
