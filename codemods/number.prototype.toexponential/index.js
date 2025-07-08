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
		name: 'number.prototype.toexponential',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const importDeclaration = removeImport(
				'number.prototype.toexponential',
				root,
				j,
			);

			if (importDeclaration) {
				return root.toSource({ quote: 'single' });
			}

			return file.source;
		},
	};
}
