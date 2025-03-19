import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-even',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('is-even', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const argument = path.node.arguments[0];
					const newExpression = j.binaryExpression(
						'===',
						j.binaryExpression(
							'%',
							// @ts-expect-error
							j.literal(argument.value),
							j.literal(2),
						),
						j.literal(0),
					);
					const wrappedExpression = j.parenthesizedExpression(newExpression);
					j(path).replaceWith(wrappedExpression);
				});

			return root.toSource(options);
		},
	};
}
