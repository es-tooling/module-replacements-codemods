import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'function-bind',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			removeImport('function-bind', root, j);

			return root.toSource(options);
		},
	};
}
