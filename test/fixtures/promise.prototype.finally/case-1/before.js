var assert = require("assert");
var promiseFinally = require("promise.prototype.finally");

var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);

promiseFinally(resolved, function () {
  assert.equal(arguments.length, 0);

  return Promise.resolve(true);
}).then(function (x) {
  assert.equal(x, 42);
});

promiseFinally(rejected, function () {
  assert.equal(arguments.length, 0);
}).catch(function (e) {
  assert.equal(e, -1);
});

promiseFinally(rejected, function () {
  assert.equal(arguments.length, 0);

  throw false;
}).catch(function (e) {
  assert.equal(e, false);
});
