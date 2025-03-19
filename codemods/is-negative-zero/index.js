import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';
/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-negative-zero',
		transform: ({ file, options }) => {
			const j = jscodeshift;

			const root = j(file.source);

			const { identifier } = removeImport('is-negative-zero', root, j);

			root
				.find(j.LogicalExpression, {
					operator: '||',
					left: {
						type: 'CallExpression',
						callee: {
							type: 'MemberExpression',
							object: { name: 'Object' },
							property: { name: 'is' },
						},
					},
					right: {
						type: 'CallExpression',
						callee: { name: identifier },
					},
				})
				.replaceWith((path) => {
					return path.node.left;
				});

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith((path) => {
					if (path.node.arguments.length === 1) {
						return j.callExpression(
							j.memberExpression(j.identifier('Object'), j.identifier('is')),
							[path.node.arguments[0], j.unaryExpression('-', j.literal(0))],
						);
					}
					return path.node;
				});

			return root.toSource(options);
		},
	};
}
