const assert = require('assert');

const obj = {
  a: 1,
  b: 2
};

const additionalProps = {
  a: {
    value: 2
  },
  c: {
		configurable: true,
		enumerable: true,
		value: 3,
		writable: true
	},
};

const updatedObj = Object.defineProperties(obj, additionalProps);

assert.equal(obj, updatedObj);