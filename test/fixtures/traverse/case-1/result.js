// THESE ARE FOR ESM IMPORTS
import assert from 'assert';
import traverse from "neotraverse/legacy";

const obj = {
	a: 1,
	b: 2,
	c: 3,
	d: {
		e: 4,
		f: 5,
	},
	g: [6, 7, 8],
};

assert.equal(typeof traverse, 'function');
assert.equal(traverse(obj).get('a'), 1);
assert.equal(traverse(obj).get('b'), 2);
assert.equal(traverse(obj).get('c'), 3);
assert.equal(traverse(obj).get('d.e'), 4);
assert.equal(traverse(obj).get('d.f'), 5);
assert.equal(traverse(obj).get('g.0'), 6);
assert.equal(traverse(obj).get('g.1'), 7);
assert.equal(traverse(obj).get('g.2'), 8);

const after = traverse(obj).map(function (x) {
	if (typeof x === 'number') {
		this.update(x ** 2);
	}
});
assert.equal(after, {
	a: 1,
	b: 4,
	c: 9,
	d: {
		e: 16,
		f: 25,
	},
	g: [36, 49, 64],
});
