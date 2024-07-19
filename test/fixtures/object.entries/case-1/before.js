var assert = require("assert");
var entries = require("object.entries");

var obj = { a: 1, b: 2, c: 3 };

var expected = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
];

assert.deepEqual(entries(obj), expected);
