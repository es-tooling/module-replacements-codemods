import jscodeshift from 'jscodeshift';
import { removeImport, transformInstanceProperty } from '../shared.js';

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
		name: 'data-view-buffer',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			// let dirty = false;

			const { identifier } = removeImport('data-view-buffer', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					transformInstanceProperty(path, 'DataView', 'buffer', j);
				});

			return root.toSource(options);
		},
	};
}
