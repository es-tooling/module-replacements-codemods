import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'object.defineproperties',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('object.defineproperties', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					return j.callExpression(
						j.memberExpression(
							j.identifier('Object'),
							j.identifier('defineProperties'),
						),
						node.arguments,
					);
				});

			return root.toSource(options);
		},
	};
}
