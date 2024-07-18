var assert = require("assert");

var obj = {
  foo: 42,
};

assert.equal(typeof Object.getOwnPropertyDescriptor, "function");
assert.equal(Object.getOwnPropertyDescriptor(obj, "foo").value, 42);
