import jscodeshift from 'jscodeshift';
import { removeImport, transformInstanceProperty } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'data-view-buffer',
		to: 'native',
		transform: ({ file, options }) => {
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
