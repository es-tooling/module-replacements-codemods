var assert = require('assert');

var target = { a: true };
Object.assign(target, { b: true });

var expected = {
    a: true,
    b: true,
};
assert.deepEqual(target, expected);