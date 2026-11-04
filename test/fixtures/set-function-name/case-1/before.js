var setFunctionName = require("set-function-name");
var assert = require("assert");

function fn() {}
setFunctionName(fn, "myFunc");

assert.equal(fn.name, "myFunc");
