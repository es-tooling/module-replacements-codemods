import isWhitespace from './is-whitespace/index.js';

import isArrayBuffer from './is-array-buffer/index.js';

import isBooleanObject from './is-boolean-object/index.js';

export const codemods = {
	'is-whitespace': isWhitespace,
	'is-array-buffer': isArrayBuffer,
	'is-boolean-object': isBooleanObject,
};
