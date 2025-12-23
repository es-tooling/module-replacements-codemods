import jscodeshift from 'jscodeshift';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'traverse',
		to: 'neotraverse',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			let dirty = false;

			// Transform import declarations
			root.find(j.ImportDeclaration).forEach((path) => {
				if (
					j.Literal.check(path.node.source) &&
					path.node.source.value === 'traverse'
				) {
					path.node.source.value = 'neotraverse/legacy';
					dirty = true;
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
						dirty = true;
					}
				});

			if (dirty) {
				return {
					code: root.toSource(options),
					replacements: {
						traverse: 'neotraverse',
					},
				};
			}

			return file.source;
		},
	};
}
