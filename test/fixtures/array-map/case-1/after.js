var assert = require("assert");

var letters = [97, 98, 99].map(function (c) {
  return String.fromCharCode(c);
});

assert.deepEqual(letters, ["a", "b", "c"]);
