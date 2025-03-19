import jscodeshift from 'jscodeshift';
import { transformStringMethod } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'string.prototype.padstart',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformStringMethod(
				'string.prototype.padstart',
				'padStart',
				root,
				j,
			);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
