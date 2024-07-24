var assert = require("assert");
var AggregateError = require("es-aggregate-error");

var oneError = new RangeError("hi!");
var otherError = new EvalError("oops");
var error = new AggregateError(
  [oneError, otherError],
  "this is two kinds of errors",
);

assert.deepEqual(error.errors, [oneError, otherError]);
assert.equal(error.message, "this is two kinds of errors");
