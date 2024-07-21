const assert = require("assert");

const o = { a: 1 };

Object.defineProperty(o, "b", { enumerable: true, value: 2 });
assert.deepEqual(
  Object.getOwnPropertyDescriptor(o, "b"),
  {
    configurable: false,
    enumerable: true,
    value: 2,
    writable: false,
  },
  "property descriptor is as expected"
);

Object.defineProperty(o, "c", { enumerable: false, value: 3, writable: true });
assert.deepEqual(
  Object.getOwnPropertyDescriptor(o, "c"),
  {
    configurable: false,
    enumerable: false,
    value: 3,
    writable: true,
  },
  "property descriptor is as expected"
);
