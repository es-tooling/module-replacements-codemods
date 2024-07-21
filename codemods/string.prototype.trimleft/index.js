import jscodeshift from 'jscodeshift';
import { transformStringMethod } from '../shared.js';

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
		name: 'string.prototype.trimleft',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformStringMethod(
				'string.prototype.trimleft',
				'trimStart',
				root,
				j,
			);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
