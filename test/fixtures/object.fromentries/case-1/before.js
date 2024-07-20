var assert = require("assert");
var fromEntries = require("object.fromentries");

var obj = { a: 1, b: 2, c: 3 };
var actual = fromEntries(Object.entries(obj));

assert.deepEqual(obj, actual);
