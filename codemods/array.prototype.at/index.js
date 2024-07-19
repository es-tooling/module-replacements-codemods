import jscodeshift from 'jscodeshift';
import { transformArrayMethod } from '../shared.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @NOTE
 * `array.prototype.at` supports passing a callback, e.g.:
 * `var results = at(arr, (x, i) => x);`
 *
 * We don't support that for now, but the most common usage seems to be similar
 * to the native usage
 *
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'array.prototype.at',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformArrayMethod('array.prototype.at', 'at', root, j);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
