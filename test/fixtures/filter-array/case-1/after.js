var assert = require("assert");

var result = ["a", "b", "c", "b", "c", "e"].filter(function (ele) {
  return ele === "a" || ele === "b";
});

assert.deepEqual(result, ["a", "b", "b"]);
