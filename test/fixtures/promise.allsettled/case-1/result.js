var assert = require("assert");

var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);

Promise.allSettled([resolved, rejected]).then(function (results) {
  assert.deepEqual(results, [
    { status: "fulfilled", value: 42 },
    { status: "rejected", reason: -1 },
  ]);
});
