var assert = require("assert");

var testSymbol = symbol("foo");

assert.equal(
  testSymbol.description,
  "foo",
);
