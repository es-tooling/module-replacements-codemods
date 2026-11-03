var setFunctionLength = require("set-function-length");
var assert = require("assert");

function fn(a, b) {}
setFunctionLength(fn, 5);

assert.equal(fn.length, 5);
