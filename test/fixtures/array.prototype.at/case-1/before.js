const assert = require('assert');
const at = require('array.prototype.at');

const arr = [1, 2];

assert.equal(at(arr, 0), arr[0]);
assert.equal(at(arr, -3), arr[0]);

assert.deepEqual(at(arr, 1), arr[1]);
assert.deepEqual(at(arr, -2), arr[1]);

assert.deepEqual(at(arr, 2), arr[2]);
assert.deepEqual(at(arr, -1), arr[2]);

assert.equal(at(arr, 3), undefined);
assert.equal(at(arr, -4), undefined);

assert.equal(at(arr, Infinity), undefined);
assert.equal(at(arr, -Infinity), undefined);

assert.equal(at([], 0), undefined);
assert.equal(at([], -1), undefined);
