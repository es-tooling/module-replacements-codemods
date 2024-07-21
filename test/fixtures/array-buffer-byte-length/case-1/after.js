const assert = require("assert");

assert.equal(
  new ArrayBuffer(0).byteLength,
  0,
  "ArrayBuffer of byteLength 0, yields 0",
);

const myArrayBuffer = new ArrayBuffer(0);

assert.equal(
  myArrayBuffer.byteLength,
  0,
  "ArrayBuffer of byteLength 0, yields 0",
);
