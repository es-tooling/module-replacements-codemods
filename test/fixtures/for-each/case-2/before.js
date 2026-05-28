import forEach from 'for-each';
import assert from 'assert';

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
