var findLast = require("array.prototype.findlast");
var assert = require("assert");

var arr = [1, [2], [], 3, [[4]]];
var isNumber = function (x) {
  return typeof x === "number";
};

assert.deepEqual(findLast(arr, isNumber), 3);
