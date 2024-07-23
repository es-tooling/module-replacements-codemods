var assert = require("assert");
var ownKeys = require("reflect.ownkeys");

var obj = { a: 1, b: 2, c: 3 };
var expected = ["a", "b", "c"];

assert.deepEqual(ownKeys(obj), expected);
