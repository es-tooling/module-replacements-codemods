var assert = require("assert");
var values = require("object.values");

var obj = { a: 1, b: 2, c: 3 };
var expected = [1, 2, 3];

assert.deepEqual(values(obj), expected);
