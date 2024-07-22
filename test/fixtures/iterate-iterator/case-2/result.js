const assert = require('assert');

assert.deepEqual(Array.from({
  [Symbol.iterator]: () => 'a 💩'[Symbol.iterator]()
}), ['a', ' ', '💩']);
assert.deepEqual(Array.from({
  [Symbol.iterator]: () => [1, 2][Symbol.iterator]()
}), [1, 2]);
assert.deepEqual(Array.from({
  [Symbol.iterator]: () => new Set([1, 2]).values()
}), [1, 2]);
assert.deepEqual(Array.from({
  [Symbol.iterator]: () => new Map([[1, 2], [3, 4]]).entries()
}), [[1, 2], [3, 4]]);

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
assert.deepStrictEqual(Array.from({
  [Symbol.iterator]: () => foo
}), [42, 42, 42, 42, 42]);

function assertWithCallback(iterable, expected) {
    const values = [];
    const callback = function (x) { values.push(x); };

    for (const i of {
      [Symbol.iterator]: () => iterable
    }) {
      callback(i);
    };

    assert.deepEqual(values, expected);
}

assertWithCallback('a 💩'[Symbol.iterator](), ['a', ' ', '💩']);
assertWithCallback([1, 2][Symbol.iterator](), [1, 2]);
assertWithCallback(new Set([1, 2]).values(), [1, 2]);
assertWithCallback(new Map([[1, 2], [3, 4]]).entries(), [[1, 2], [3, 4]]);

for (const i of {
  [Symbol.iterator]: () => [1, 2][Symbol.iterator]()
}) {
  (function (x) { console.log(x); })(i);
};

for (const i of {
  [Symbol.iterator]: () => [1, 2][Symbol.iterator]()
}) {
  (x => console.log(x))(i);
};
