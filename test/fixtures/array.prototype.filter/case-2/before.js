import filter from 'array.prototype.filter';
var assert = require('assert');

assert.deepEqual(
  filter([1, 2, 3], function (x) {
    return x >= 2;
  }),
  [2, 3],
);
assert.deepEqual(
  filter([1, 2, 3], function (x) {
    return x <= 2;
  }),
  [1, 2],
);
