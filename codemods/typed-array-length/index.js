import jscodeshift from 'jscodeshift';
import { removeImport, transformInstanceProperty } from '../shared.js';
import { ALL_TYPED_ARRAY_OBJECTS } from '../CONSTANTS.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'typed-array-length',
		to: 'native',
		transform: ({ file, options }) => {
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
