const assert = require('assert');
const { differentNameForModule } = require('is-plain-object');

// Test cases
assert.strictEqual(differentNameForModule(Object.create({})), false);
assert.strictEqual(differentNameForModule(Object.create(Object.prototype)), true);
assert.strictEqual(differentNameForModule({ foo: 'bar' }), true);
assert.strictEqual(differentNameForModule({}), true);
assert.strictEqual(differentNameForModule(null), false);

assert.strictEqual(differentNameForModule(1), false);
assert.strictEqual(differentNameForModule(['foo', 'bar']), false);
assert.strictEqual(differentNameForModule([]), false);

const Foo = function () {
    return { foo: Math.random() > 0.5 ? 'bar' : 'baz' };
};
assert.strictEqual(differentNameForModule(Foo), false);
assert.strictEqual(differentNameForModule(Foo()), true);
assert.strictEqual(differentNameForModule(Object.create(null)), true);

const bar = { ...{ foo: 'bar' } };
const baz = { ...bar };
assert.strictEqual(differentNameForModule({ ...baz }), true);

const apple = Math.random() > 0.5 ? { foo: 'bar' } : { bar: 'baz' };
assert.strictEqual(differentNameForModule(apple), true);

const orange = () => Math.random() > 0.5 ? { foo: 'bar' } : { bar: 'baz' };
assert.strictEqual(differentNameForModule(orange), false);
