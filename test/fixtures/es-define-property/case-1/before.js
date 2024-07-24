const assert = require("assert");
const $defineProperty = require("es-define-property");

const o = { a: 1 };

$defineProperty(o, "b", { enumerable: true, value: 2 });
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

$defineProperty(o, "c", { enumerable: false, value: 3, writable: true });
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
