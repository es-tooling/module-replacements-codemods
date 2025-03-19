import jscodeshift from 'jscodeshift';
import { transformArrayMethod } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'array.prototype.reduce',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformArrayMethod(
				'array.prototype.reduce',
				'reduce',
				root,
				j,
			);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
