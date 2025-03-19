/**
 * @import { Codemod } from "../../types.js"
 */

import jscodeshift from 'jscodeshift';

import { removeImport } from '../shared.js';

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'number.isinteger',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const importDeclaration = removeImport('number.isinteger', root, j);

			if (importDeclaration) {
				return root.toSource(options);
			}

			return file.source;
		},
	};
}
