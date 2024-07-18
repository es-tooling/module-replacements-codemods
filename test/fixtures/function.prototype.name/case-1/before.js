var functionName = require("function.prototype.name");
var assert = require("assert");

assert.equal(
  functionName(function foo() {}),
  "foo",
);
