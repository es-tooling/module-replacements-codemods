const assert = require('assert');

const define = function (object, map) {
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
    })
	}

  return object;
};

const res1 = define({ a: 1, b: 2 }, {
  a: 10,
  b: 20,
  c: 30,
  [Symbol.for('d')]: 40
});

assert(res1.a === 1);
assert(res1.b === 2);
assert(res1.c === 30);
assert(res1[Symbol.for('d')] === 40);

assert.deepEqual(Object.keys(res1), ['a', 'b']);
assert.deepEqual(Object.getOwnPropertyDescriptor(res1, 'c'), {
  configurable: true,
  enumerable: false,
  value: 30,
  writable: false
});
