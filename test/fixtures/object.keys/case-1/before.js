require('object.keys');
const assert = require('assert');

const obj = { a: 1, b: 2, c: 3 };
const expected = ['a', 'b', 'c'];

assert.deepEqual(Object.keys(obj), expected);