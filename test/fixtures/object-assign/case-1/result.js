const assert = require('assert');

const res = Object.assign({});
const expect = {};
assert.deepEqual(res, expect)

const res1 = Object.assign({ foo: 0 }, { bar: 1 });
const expect1 = { foo: 0, bar: 1 };
assert.deepEqual(res1, expect1);

const res2 = Object.assign({ foo: 0 }, { bar: 1 }, { baz: 2 });
const expect2 = { foo: 0, bar: 1, baz: 2 };
assert.deepEqual(res2, expect2);

const res3 = Object.assign({ foo: 0 }, { foo: 1 }, { foo: 2 });
const expect3 = { foo: 2 };
assert.deepEqual(res3, expect3);

const res4 = Object.assign({ foo: 0 }, null, { bar: 1 }, undefined);
const expect4 = { foo: 0, bar: 1 };
assert.deepEqual(res4, expect4);
