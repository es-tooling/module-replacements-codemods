var assert = require("assert");

assert.equal(
  (function foo() {}).name,
  "foo",
);
