var assert = require('assert');

var a = [1, 2, 3];
assert.equal(
    true,
    a.forEach(function (x) {
        return x === 2;
    }),
);
assert.equal(
    false,
    a.forEach(function (x) {
        return x === 4;
    }),
);
