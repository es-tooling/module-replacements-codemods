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
		name: 'traverse',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			// Transform import declarations
			root.find(j.ImportDeclaration).forEach((path) => {
				if (
					j.Literal.check(path.node.source) &&
					path.node.source.value === 'traverse'
				) {
					path.node.source.value = 'neotraverse/legacy';
				}
			});

			// Transform require statements
			root
				.find(j.CallExpression, { callee: { name: 'require' } })
				.forEach((path) => {
					if (
						path.node.arguments.length === 1 &&
						j.Literal.check(path.node.arguments[0]) &&
						path.node.arguments[0].value === 'traverse'
					) {
						path.node.arguments[0].value = 'neotraverse/legacy';
					}
				});

			return root.toSource({ quote: 'single' });
		},
	};
}
