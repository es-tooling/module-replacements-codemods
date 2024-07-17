import jscodeshift from 'jscodeshift';

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

			// Find the import or require statement for 'is-whitespace'
			const importDeclaration = root.find(j.ImportDeclaration, {
				source: {
					value: 'is-whitespace',
				},
			});

			const requireDeclaration = root.find(j.VariableDeclarator, {
				init: {
					callee: {
						name: 'require',
					},
					arguments: [
						{
							value: 'is-whitespace',
						},
					],
				},
			});

			// If 'is-whitespace' is not found in the imported packages, return the original source code
			if (importDeclaration.size() === 0 && requireDeclaration.size() === 0) {
				return root.toSource();
			}

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

			// Remove the import or require statement for 'is-whitespace'
			importDeclaration.remove();
			requireDeclaration.remove();

			return root.toSource({ quote: 'single' });
		},
	};
}
