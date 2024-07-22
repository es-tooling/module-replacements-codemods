const extend = require('xtend');
const assert = require('assert');

const objectA = {
  a: 1,
  b: 2,
  c: 3,
};

const objectB = {
  a: 20,
  d: 40,
};

assert.equal(extend(objectA, objectB), { a: 20, b: 2, c: 3, d: 40 });