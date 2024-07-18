var assert = require("assert");

var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  assert.equal(result, 42);
});

Promise.any([rejected, alsoRejected]).catch(function (error) {
  assert.ok(error instanceof AggregateError);
  assert.deepEqual(error.errors, [-1, Infinity]);
});
