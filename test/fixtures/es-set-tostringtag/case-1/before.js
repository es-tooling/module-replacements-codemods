const assert = require("assert");
const setToStringTag = require("es-set-tostringtag");

const obj = {};
const sentinel = {};

setToStringTag(obj, sentinel);

assert.equal(
  obj[Symbol.toStringTag],
  sentinel,
  "toStringTag property is as expected"
);

assert.equal(String(obj), "[object Object]", "toStringTag works");

var tagged = {};
tagged[Symbol.toStringTag] = "already tagged";
assert.equal(String(tagged), "[object already tagged]", "toStringTag works");

setToStringTag(tagged, "new tag");
assert.equal(
  String(tagged),
  "[object already tagged]",
  "toStringTag is unchanged"
);
