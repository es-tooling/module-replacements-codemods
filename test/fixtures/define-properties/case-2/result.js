const define = require('define-properties');
const assert = require('assert');

const res1 = define({ a: 1, b: 2 }, {
  a: 10,
  b: 20,
  c: 30
}, {});

assert(res1.a === 1);
assert(res1.b === 2);
assert(res1.c === 30);

assert.deepEqual(Object.keys(res1), ['a', 'b']);
assert.deepEqual(Object.getOwnPropertyDescriptor(res1, 'c'), {
  configurable: true,
  enumerable: false,
  value: 30,
  writable: false
});
