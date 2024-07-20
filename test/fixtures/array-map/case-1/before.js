var map = require("array-map");
var assert = require("assert");

var letters = map([97, 98, 99], function (c) {
  return String.fromCharCode(c);
});

assert.deepEqual(letters, ["a", "b", "c"]);
