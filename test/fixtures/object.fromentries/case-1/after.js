var assert = require("assert");

var obj = { a: 1, b: 2, c: 3 };
var actual = Object.fromEntries(Object.entries(obj));

assert.deepEqual(obj, actual);
