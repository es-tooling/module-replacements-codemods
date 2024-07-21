var symbolDescription = require("get-symbol-description");
var assert = require("assert");

var testSymbol = symbol("foo");

assert.equal(
  symbolDescription(testSymbol),
  "foo",
);
