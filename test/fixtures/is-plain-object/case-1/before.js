import assert from 'assert';
import { isPlainObject as isPlainObj } from 'is-plain-object';

// Test cases
assert.strictEqual(isPlainObj(Object.create({})), false);
assert.strictEqual(isPlainObj(Object.create(Object.prototype)), true);
assert.strictEqual(isPlainObj({ foo: 'bar' }), true);
assert.strictEqual(isPlainObj({}), true);
assert.strictEqual(isPlainObj(null), false);

assert.strictEqual(isPlainObj(1), false);
assert.strictEqual(isPlainObj(['foo', 'bar']), false);
assert.strictEqual(isPlainObj([]), false);

const Foo = function () {
    return { foo: Math.random() > 0.5 ? 'bar' : 'baz' };
};
assert.strictEqual(isPlainObj(Foo), false);
assert.strictEqual(isPlainObj(Foo()), true);
assert.strictEqual(isPlainObj(Object.create(null)), true);

const bar = { ...{ foo: 'bar' } };
const baz = { ...bar };
assert.strictEqual(isPlainObj({ ...baz }), true);

const apple = Math.random() > 0.5 ? { foo: 'bar' } : { bar: 'baz' };
assert.strictEqual(isPlainObj(apple), true);

const orange = () => Math.random() > 0.5 ? { foo: 'bar' } : { bar: 'baz' };
assert.strictEqual(isPlainObj(orange), false);