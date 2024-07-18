var gOPD = require("gopd");
var assert = require("assert");

var obj = {
  foo: 42,
};

assert.equal(typeof gOPD, "function");
assert.equal(gOPD(obj, "foo").value, 42);
