var assert = require("assert");

assert("abcabc".lastIndexOf("abc") === 3);
assert("abcabc".lastIndexOf("abc", 0) === 0);
assert("abcabc".lastIndexOf("abc", 1) === 0);
assert("abcabc".lastIndexOf("abc", 2) === 0);
assert("abcabc".lastIndexOf("abc", 3) === 3);
assert("abcabc".lastIndexOf("abc", 4) === 3);
assert("abcabc".lastIndexOf("abc", 5) === 3);
assert("abcabc".lastIndexOf("abc", 6) === 3);

assert("abc".lastIndexOf("x") === -1);
