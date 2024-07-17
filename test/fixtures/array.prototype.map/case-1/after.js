var assert = require("assert");

assert.deepEqual(
  [1, 1, 1].map(function (x) {
    return x + 1;
  }),
  [2, 2, 2],
);
assert.deepEqual(
  [1, 0, 1].map(function (x) {
    return x + 1;
  }),
  [2, 1, 2],
);
