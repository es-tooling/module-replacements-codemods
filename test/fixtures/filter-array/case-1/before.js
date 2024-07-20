var filter = require("filter-array");
var assert = require("assert");

var result = filter(["a", "b", "c", "b", "c", "e"], function (ele) {
  return ele === "a" || ele === "b";
});

assert.deepEqual(result, ["a", "b", "b"]);
