import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @TODO
 * Remove the dep from package.json!
 * - can glob for all package.jsons, and remove it?
 */

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-whitespace',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('is-whitespace', root, j);

			// Find the 'isWhitespace' function calls
			root
				.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				})
				.replaceWith((path) => {
					// Replace 'isWhitespace(str)' with 'str.trim() === '''
					const argument = path.node.arguments[0];
					return j.binaryExpression(
						'===',
						j.callExpression(
							// @ts-expect-error
							j.memberExpression(argument, j.identifier('trim'), false),
							[],
						),
						j.literal(''),
					);
				});

			return root.toSource(options);
		},
	};
}
