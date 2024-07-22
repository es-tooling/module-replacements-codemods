var assert = require("assert");
var lastIndexOf = require("string.prototype.lastindexof");

assert(lastIndexOf("abcabc", "abc") === 3);
assert(lastIndexOf("abcabc", "abc", 0) === 0);
assert(lastIndexOf("abcabc", "abc", 1) === 0);
assert(lastIndexOf("abcabc", "abc", 2) === 0);
assert(lastIndexOf("abcabc", "abc", 3) === 3);
assert(lastIndexOf("abcabc", "abc", 4) === 3);
assert(lastIndexOf("abcabc", "abc", 5) === 3);
assert(lastIndexOf("abcabc", "abc", 6) === 3);

assert("abc".lastIndexOf("x") === -1);
