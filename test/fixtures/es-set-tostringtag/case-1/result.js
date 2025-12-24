const assert = require("assert");

const obj = {};
const sentinel = {};

!Object.hasOwn(obj, Symbol.toStringTag) && Object.defineProperty(obj, Symbol.toStringTag, {
  configurable: true,
  enumerable: false,
  value: 'sentinel',
  writable: false
});

assert.equal(
  obj[Symbol.toStringTag],
  sentinel,
  "toStringTag property is as expected"
);

assert.equal(String(obj), "[object Object]", "toStringTag works");

const tagged = {};
tagged[Symbol.toStringTag] = "already tagged";
assert.equal(String(tagged), "[object already tagged]", "toStringTag works");

!Object.hasOwn(tagged, Symbol.toStringTag) && Object.defineProperty(tagged, Symbol.toStringTag, {
  configurable: true,
  enumerable: false,
  value: "new tag",
  writable: false
});
assert.equal(
  String(tagged),
  "[object already tagged]",
  "toStringTag is unchanged"
);

Object.defineProperty(tagged, Symbol.toStringTag, {
  configurable: true,
  enumerable: false,
  value: 'new tag',
  writable: false
});
assert.equal(
  String(tagged),
  "[object new tag]",
  "toStringTag is unchanged"
);
