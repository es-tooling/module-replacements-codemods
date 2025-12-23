/**
 * @import { Codemod, CodemodOptions } from "../../types.js"
 */

import jscodeshift from 'jscodeshift';

import { removeImport } from '../shared.js';

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'number.issafeinteger',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const importDeclaration = removeImport('number.issafeinteger', root, j);

			if (importDeclaration) {
				return root.toSource(options);
			}

			return file.source;
		},
	};
}
