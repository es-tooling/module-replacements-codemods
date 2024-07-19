var assert = require("assert");

var obj = { a: 1, b: 2, c: 3 };

var expected = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
];

assert.deepEqual(Object.entries(obj), expected);
