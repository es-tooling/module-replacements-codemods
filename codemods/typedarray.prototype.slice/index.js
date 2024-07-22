import jscodeshift from 'jscodeshift';
import {
	removeImport,
	transformInstanceMethod,
	transformInstanceProperty,
} from '../shared.js';
import { ALL_TYPED_ARRAY_OBJECTS } from '../../CONSTANTS.js';

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
		name: 'typedarray.prototype.slice',
		transform: ({ file }) => {
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
