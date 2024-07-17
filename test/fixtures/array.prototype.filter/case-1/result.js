var assert = require("assert");

assert.deepEqual(
  [1, 2, 3].filter(function (x) {
    return x >= 2;
  }),
  [2, 3],
);
assert.deepEqual(
  [1, 2, 3].filter(function (x) {
    return x <= 2;
  }),
  [1, 2],
);
