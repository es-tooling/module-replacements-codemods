import jscodeshift from 'jscodeshift';
import { ALL_TYPED_ARRAY_OBJECTS } from '../CONSTANTS.js';
import { removeImport, transformInstanceMethod } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'typedarray.prototype.slice',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirty = false;

			const { identifier } = removeImport(
				'typedarray.prototype.slice',
				root,
				j,
			);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					for (const typedArrayObject of ALL_TYPED_ARRAY_OBJECTS) {
						const dirtyFlag = transformInstanceMethod(
							path,
							typedArrayObject,
							'slice',
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
