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
		name: 'left-pad',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('left-pad', root, j);
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					const [stringArg, ...otherArgs] = node.arguments;
					return j.callExpression(
						j.memberExpression(
							j.callExpression(
								j.memberExpression(
									// @ts-ignore
									j.parenthesizedExpression(stringArg),
									j.identifier('toString'),
								),
								[],
							),
							j.identifier('padStart'),
						),
						[...otherArgs],
					);
				});

			return root.toSource(options);
		},
	};
}
