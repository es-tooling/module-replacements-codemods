import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

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
		name: 'regexp.prototype.flags',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			// Remove import/require statement
			const { identifier } = removeImport('regexp.prototype.flags', root, j);

			// Remove flags.shim()
			root
				.find(j.ExpressionStatement, {
					expression: {
						callee: {
							type: 'MemberExpression',
							object: { name: identifier },
							property: { name: 'shim' },
						},
					},
				})
				.forEach((path) => {
					j(path).remove();
				});

			// Replace flags(arg) with arg.flags
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const args = path.node.arguments;
					if (args.length !== 1) return; // flags takes exactly one argument
					if (j.Expression.check(args[0]) && !j.SpreadElement.check(args[0])) {
						path.replace(j.memberExpression(args[0], j.identifier('flags')));
					}
				});

			return root.toSource({ quote: 'single' });
		},
	};
}
