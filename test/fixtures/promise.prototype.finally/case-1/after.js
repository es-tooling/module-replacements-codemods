var assert = require("assert");

var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);

resolved.finally(function () {
  assert.equal(arguments.length, 0);

  return Promise.resolve(true);
}).then(function (x) {
  assert.equal(x, 42);
});

rejected.finally(function () {
  assert.equal(arguments.length, 0);
}).catch(function (e) {
  assert.equal(e, -1);
});

rejected.finally(function () {
  assert.equal(arguments.length, 0);

  throw false;
}).catch(function (e) {
  assert.equal(e, false);
});
