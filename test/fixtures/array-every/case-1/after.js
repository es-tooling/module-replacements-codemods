var assert = require("assert");

var result = ["a", "b", "c"].every(function (ele) {
  return ele === "a";
});

assert.equal(result, true);
