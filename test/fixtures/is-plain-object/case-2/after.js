const assert = require('assert');

// Test cases
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(Object.create({})), false);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(Object.create(Object.prototype)), true);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})({ foo: 'bar' }), true);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})({}), true);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(null), false);

assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(1), false);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(['foo', 'bar']), false);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})([]), false);

const Foo = function () {
    return { foo: Math.random() > 0.5 ? 'bar' : 'baz' };
};
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(Foo), false);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(Foo()), true);
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(Object.create(null)), true);

const bar = { ...{ foo: 'bar' } };
const baz = { ...bar };
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})({ ...baz }), true);

const apple = Math.random() > 0.5 ? { foo: 'bar' } : { bar: 'baz' };
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(apple), true);

const orange = () => Math.random() > 0.5 ? { foo: 'bar' } : { bar: 'baz' };
assert.strictEqual((v => {
    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));
})(orange), false);
