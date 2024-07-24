var assert = require("assert");

var xs = [1, 2, 3, 4, 5, 6];
var ys = xs.flatMap(function (x) {
  return x % 2 ? [x - 0.1, x, x + 0.1] : [];
});

assert.deepEqual(ys, [0.9, 1, 1.1, 2.9, 3, 3.1, 4.9, 5, 5.1]);
