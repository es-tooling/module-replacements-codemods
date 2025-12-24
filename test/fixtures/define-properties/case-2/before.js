const define = require('define-properties');
const assert = require('assert');

const object1 = { a: 1, b: 2 };

const res1 = define(object1, {
  a: 10,
  b: 20,
  c: 30,
  [Symbol.for('d')]: 40
});

assert(res1.a === 1);
assert(res1.b === 2);
assert(res1.c === 30);
assert(res1[Symbol.for('d')] === 40);

assert.deepEqual(res1, {
  a: 1,
  b: 2
})

assert.deepEqual(Object.keys(res1), ['a', 'b']);
assert.deepEqual(Object.getOwnPropertyNames(res1), ['a', 'b', 'c']);
assert.deepEqual(Object.getOwnPropertyDescriptor(res1, 'c'), {
  configurable: true,
  enumerable: false,
  value: 30,
  writable: true
});

const object2 = { a: 1, b: 2 };

define(object2, {
  c: 30
})

assert(object2.a === 1);
assert(object2.b === 2);
assert(object2.c === 30);
