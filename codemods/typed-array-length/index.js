import jscodeshift from 'jscodeshift';
import { removeImport, transformInstanceProperty } from '../shared.js';
import { ALL_TYPED_ARRAY_OBJECTS } from '../CONSTANTS.js';

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
		name: 'typed-array-length',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirty = false;

			const { identifier } = removeImport('typed-array-length', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					for (const typedArrayObject of ALL_TYPED_ARRAY_OBJECTS) {
						const dirtyFlag = transformInstanceProperty(
							path,
							typedArrayObject,
							'length',
							j,
						);

						if (dirtyFlag) {
							dirty = true;
							break;
						}
					}
				});

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
