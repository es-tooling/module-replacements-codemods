import banana from 'for-each';
import assert from 'assert';

var a = [1, 2, 3];
assert.equal(
    true,
    banana(a, function (x) {
        return x === 2;
    }),
);
assert.equal(
    false,
    banana(a, function (x) {
        return x === 4;
    }),
);
