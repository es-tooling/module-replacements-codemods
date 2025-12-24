const getIterator = require('es-get-iterator');
const assert = require('assert');

const iterator1 = getIterator('a 💩');
assert.deepEqual(
	[iterator1.next(), iterator1.next(), iterator1.next(), iterator1.next()],
	[{ done: false, value: 'a' }, { done: false, value: ' ' }, { done: false, value: '💩' }, { done: true, value: undefined }]
);

const iterator2 = getIterator([1, 2]);
assert.deepEqual(
	[iterator2.next(), iterator2.next(), iterator2.next()],
	[{ done: false, value: 1 }, { done: false, value: 2 }, { done: true, value: undefined }]
);

const iterator3 = getIterator(new Set([1, 2]));
assert.deepEqual(
	[iterator3.next(), iterator3.next(), iterator3.next()],
	[{ done: false, value: 1 }, { done: false, value: 2 }, { done: true, value: undefined }]
);

const iterator4 = getIterator(new Map([[1, 2], [3, 4]]));
assert.deepEqual(
	[iterator4.next(), iterator4.next(), iterator4.next()],
	[{ done: false, value: [1, 2] }, { done: false, value: [3, 4] }, { done: true, value: undefined }]
);
