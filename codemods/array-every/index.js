import jscodeshift from 'jscodeshift';
import { transformArrayMethod } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'array-every',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformArrayMethod('array-every', 'every', root, j);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
