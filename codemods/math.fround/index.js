import jscodeshift from 'jscodeshift';
import { transformMathPolyfill } from '../shared.js';

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
		name: 'math.fround',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformMathPolyfill(
				'math.fround/polyfill',
				'fround',
				root,
				j,
			);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
