import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'number.isnan',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			let { identifier } = removeImport('number.isnan', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					return j.callExpression(
						j.memberExpression(j.identifier('Number'), j.identifier('isNaN')),
						node.arguments,
					);
				});

			return root.toSource(options);
		},
	};
}
