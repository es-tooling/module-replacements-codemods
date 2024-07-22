import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

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
		name: 'function-bind',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			removeImport('function-bind', root, j);

			return root.toSource(options);
		},
	};
}
