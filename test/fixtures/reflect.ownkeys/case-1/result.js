var assert = require("assert");

var obj = { a: 1, b: 2, c: 3 };
var expected = ["a", "b", "c"];

assert.deepEqual(Reflect.ownKeys(obj), expected);
