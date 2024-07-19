var forEach = require('for-each');
var assert = require('assert');

var a = [1, 2, 3];
assert.equal(
    true,
    forEach(a, function (x) {
        return x === 2;
    }),
);
assert.equal(
    false,
    forEach(a, function (x) {
        return x === 4;
    }),
);
