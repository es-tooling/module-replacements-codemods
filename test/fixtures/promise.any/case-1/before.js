var assert = require("assert");
var any = require("promise.any");

var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

any([resolved, rejected, alsoRejected]).then(function (result) {
  assert.equal(result, 42);
});

any([rejected, alsoRejected]).catch(function (error) {
  assert.ok(error instanceof AggregateError);
  assert.deepEqual(error.errors, [-1, Infinity]);
});
