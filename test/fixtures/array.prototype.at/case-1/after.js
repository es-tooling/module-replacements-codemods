const assert = require('assert');

const arr = [1, 2];

assert.equal(arr.at(0), arr[0]);
assert.equal(arr.at(-3), arr[0]);

assert.deepEqual(arr.at(1), arr[1]);
assert.deepEqual(arr.at(-2), arr[1]);

assert.deepEqual(arr.at(2), arr[2]);
assert.deepEqual(arr.at(-1), arr[2]);

assert.equal(arr.at(3), undefined);
assert.equal(arr.at(-4), undefined);

assert.equal(arr.at(Infinity), undefined);
assert.equal(arr.at(-Infinity), undefined);

assert.equal([].at(0), undefined);
assert.equal([].at(-1), undefined);
