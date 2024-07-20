var assert = require("assert");

var obj = { a: 1, b: 2, c: 3 };
var expected = [1, 2, 3];

assert.deepEqual(Object.values(obj), expected);
