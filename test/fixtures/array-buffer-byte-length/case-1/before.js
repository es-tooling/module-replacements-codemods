const assert = require("assert");
const byteLength = require("array-buffer-byte-length");

assert.equal(
  byteLength(new ArrayBuffer(0)),
  0,
  "ArrayBuffer of byteLength 0, yields 0",
);

const myArrayBuffer = new ArrayBuffer(0);

assert.equal(
  byteLength(myArrayBuffer),
  0,
  "ArrayBuffer of byteLength 0, yields 0",
);
