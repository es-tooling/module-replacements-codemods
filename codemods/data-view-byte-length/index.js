import jscodeshift from 'jscodeshift';
import { removeImport, transformInstanceProperty } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'data-view-byte-length',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('data-view-byte-length', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					transformInstanceProperty(path, 'DataView', 'byteLength', j);
				});

			return root.toSource(options);
		},
	};
}
