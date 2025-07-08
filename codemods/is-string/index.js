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
		name: 'is-string',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('is-string', root, j);

			// Replace all calls to isString with Object.prototype.toString.call
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith((path) => {
					const arg = path.node.arguments[0];
					return j.callExpression(
						j.memberExpression(
							j.memberExpression(
								j.memberExpression(
									j.identifier('Object'),
									j.identifier('prototype'),
								),
								j.identifier('toString'),
							),
							j.identifier('call'),
						),
						[arg],
					);
				})
				.forEach((path) => {
					const parent = path.parent.node;
					if (j.BinaryExpression.check(parent)) {
						parent.operator = '===';
						parent.right = j.literal('[object String]');
					} else if (
						j.CallExpression.check(parent) &&
						parent.arguments.length === 1
					) {
						const newExpression = j.binaryExpression(
							'===',
							path.node,
							j.literal('[object String]'),
						);
						parent.arguments[0] = newExpression;
					}
				});

			return root.toSource({ quote: 'single' });
		},
	};
}
