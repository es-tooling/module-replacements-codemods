const assert = require("assert");

const obj = {};
const sentinel = {};

Object.defineProperty(obj, Symbol.toStringTag, {
  configurable: true,
  value: sentinel
});

assert.equal(
  obj[Symbol.toStringTag],
  sentinel,
  "toStringTag property is as expected"
);

assert.equal(String(obj), "[object Object]", "toStringTag works");

var tagged = {};
tagged[Symbol.toStringTag] = "already tagged";
assert.equal(String(tagged), "[object already tagged]", "toStringTag works");

Object.defineProperty(tagged, Symbol.toStringTag, {
  configurable: true,
  value: "new tag"
});
assert.equal(
  String(tagged),
  "[object already tagged]",
  "toStringTag is unchanged"
);
