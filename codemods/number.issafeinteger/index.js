/**
 * @import { Codemod, CodemodOptions } from "../../types.js"
 */

import jscodeshift from 'jscodeshift';

import { removeImport } from '../shared.js';

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'number.issafeinteger',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const importDeclaration = removeImport('number.issafeinteger', root, j);

			if (importDeclaration) {
				return root.toSource({ quote: 'single' });
			}

			return file.source;
		},
	};
}
