var every = require("array-every");
var assert = require("assert");

var result = every(["a", "b", "c"], function (ele) {
  return ele === "a";
});

assert.equal(result, true);
