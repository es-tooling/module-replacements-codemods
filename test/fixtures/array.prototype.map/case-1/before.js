var map = require("array.prototype.map");
var assert = require("assert");

assert.deepEqual(
  map([1, 1, 1], function (x) {
    return x + 1;
  }),
  [2, 2, 2],
);
assert.deepEqual(
  map([1, 0, 1], function (x) {
    return x + 1;
  }),
  [2, 1, 2],
);
