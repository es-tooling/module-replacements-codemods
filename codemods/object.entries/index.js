import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'object.entries',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			let { identifier } = removeImport('object.entries', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					return j.callExpression(
						j.memberExpression(j.identifier('Object'), j.identifier('entries')),
						node.arguments,
					);
				});

			return root.toSource(options);
		},
	};
}
