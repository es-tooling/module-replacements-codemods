var assert = require("assert");
var allSettled = require("promise.allsettled");

var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);

allSettled([resolved, rejected]).then(function (results) {
  assert.deepEqual(results, [
    { status: "fulfilled", value: 42 },
    { status: "rejected", reason: -1 },
  ]);
});
