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
		name: 'symbol.prototype.description',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			// Remove import/require statement
			const { identifier } = removeImport(
				'symbol.prototype.description',
				root,
				j,
			);

			// Remove description.shim()
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

			// Replace description(Symbol('foo')) with Symbol('foo').description
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const args = path.node.arguments;
					const newArgs =
						args.length === 1 && j.CallExpression.check(args[0])
							? args[0].arguments
							: [];
					path.replace(
						j.memberExpression(
							j.callExpression(j.identifier('Symbol'), newArgs),
							j.identifier('description'),
						),
					);
				});

			return root.toSource({ quote: 'single' });
		},
	};
}
