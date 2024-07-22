Function.prototype.bind = require('function-bind');
const assert = require('assert');

const testObject = {
  name: 'John Doe',
};

function testFunc() {
  return this.name;
};

const boundFunc = testFunc.bind(testObject);

assert.equal(boundFunc(), 'John Doe');