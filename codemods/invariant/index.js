import jscodeshift from 'jscodeshift';

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
		name: 'invariant',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			// Transform import declarationss
			// biome-ignore lint/complexity/noForEach: Need to iterate through statements.
			root.find(j.ImportDeclaration).forEach((path) => {
				if (
					j.Literal.check(path.node.source) &&
					path.node.source.value === 'invariant'
				) {
					path.node.source.value = 'tiny-invariant';
				}
			});

			// Transform require statements
			// biome-ignore lint/complexity/noForEach: Need to iterate through statements.
			root
				.find(j.CallExpression, { callee: { name: 'require' } })
				.forEach((path) => {
					if (
						path.node.arguments.length === 1 &&
						j.Literal.check(path.node.arguments[0]) &&
						path.node.arguments[0].value === 'invariant'
					) {
						path.node.arguments[0].value = 'tiny-invariant';
					}
				});

			return root.toSource();
		},
	};
}
