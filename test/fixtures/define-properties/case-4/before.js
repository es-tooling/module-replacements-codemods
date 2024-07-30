const define = require('define-properties');
const assert = require('assert');

require("fake/auto");
import fake from "fake";

const $define = function (object, map) {
  let propKeys = Object.keys(map);
  propKeys = propKeys.concat(Object.getOwnPropertySymbols(map));

  for (var i = 0; i < propKeys.length; i += 1) {
    const propKey = propKeys[i];
    const value = map[propKey];

    if (propKey in object) {
      continue;
    }

    Object.defineProperty(object, propKey, {
      value,
      configurable: true,
      enumerable: false,
      writable: true,
    })
  }

  return object;
};

$define({ a: 1, b: 2 }, {
  a: 10,
  b: 20,
  c: 30,
  [Symbol.for('d')]: 40
});

define({ a: 1, b: 2, c: 3 }, {
  a: 10,
  b: 20,
  c: 30
}, {
  a: function () { return false; },
  b: function () { return true; }
});
