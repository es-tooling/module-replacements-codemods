var banana = require('array.prototype.map');
var assert = require('assert');

assert.deepEqual(
  banana([1, 1, 1], function (x) {
    return x + 1;
  }),
  [2, 2, 2],
);
assert.deepEqual(
  banana([1, 0, 1], function (x) {
    return x + 1;
  }),
  [2, 1, 2],
);
