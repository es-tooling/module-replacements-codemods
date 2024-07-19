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
		name: 'is-odd',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			removeImport('is-odd', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: 'isOdd',
					},
				})
				.forEach((path) => {
					const argument = path.node.arguments[0];
					const newExpression = j.binaryExpression(
						'!==',
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

			return root.toSource({ quote: 'single' });
		},
	};
}