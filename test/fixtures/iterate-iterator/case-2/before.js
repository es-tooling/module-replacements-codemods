const assert = require('assert');
const iterate = require('iterate-iterator');

assert.deepEqual(iterate('a 💩'[Symbol.iterator]()), ['a', ' ', '💩']);
assert.deepEqual(iterate([1, 2][Symbol.iterator]()), [1, 2]);
assert.deepEqual(iterate(new Set([1, 2]).values()), [1, 2]);
assert.deepEqual(iterate(new Map([[1, 2], [3, 4]]).entries()), [[1, 2], [3, 4]]);

const foo = {
    count: 0,
    next() {
      if (this.count < 5) {
        this.count++;
        return { done: false, value: 42 };
      } else {
        return { done: true };
      }
    }
  };
  assert.deepStrictEqual(iterate(foo), [42, 42, 42, 42, 42]);

function assertWithCallback(iterable, expected) {
    const values = [];
    const callback = function (x) { values.push(x); };

    iterate(iterable, callback);

    assert.deepEqual(values, expected);
}

assertWithCallback('a 💩'[Symbol.iterator](), ['a', ' ', '💩']);
assertWithCallback([1, 2][Symbol.iterator](), [1, 2]);
assertWithCallback(new Set([1, 2]).values(), [1, 2]);
assertWithCallback(new Map([[1, 2], [3, 4]]).entries(), [[1, 2], [3, 4]]);

iterate([1, 2][Symbol.iterator](), function (x) { console.log(x); });

iterate([1, 2][Symbol.iterator](), x => console.log(x));
