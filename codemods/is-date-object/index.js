import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-date-object',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('is-date-object', root, j);

			// Replace all calls to isDate with Object.prototype.toString.call
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
						parent.right = j.literal('[object Date]');
					} else if (
						j.CallExpression.check(parent) &&
						parent.arguments.length === 1
					) {
						const newExpression = j.binaryExpression(
							'===',
							path.node,
							j.literal('[object Date]'),
						);
						parent.arguments[0] = newExpression;
					}
				});

			return root.toSource(options);
		},
	};
}
