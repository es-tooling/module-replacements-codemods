import jscodeshift from 'jscodeshift';
import { transformArrayMethod } from '../shared.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'filter-array',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformArrayMethod('filter-array', 'filter', root, j);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
