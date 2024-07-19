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
		name: 'array.prototype.map',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

      const dirty = transformArrayMethod(
        'array.prototype.map',
        'map',
        root,
        j,
      );

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
