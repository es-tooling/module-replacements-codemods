var findLastIndex = require("array.prototype.findlastindex");
var assert = require("assert");

var arr = [1, [2], [], 3, [[4]]];
var isNumber = function (x) {
  return typeof x === "number";
};

assert.deepEqual(findLastIndex(arr, isNumber), 3);
