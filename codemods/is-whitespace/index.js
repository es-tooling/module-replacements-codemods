import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @TODO
 * Remove the dep from package.json!
 * - can glob for all package.jsons, and remove it?
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'is-whitespace',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

      removeImport('is-whitespace', root, j);


			// Find the 'isWhitespace' function calls
			root
				.find(j.CallExpression, {
					callee: {
						name: 'isWhitespace',
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

			return root.toSource({ quote: 'single' });
		},
	};
}
