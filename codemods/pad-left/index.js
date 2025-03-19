import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'pad-left',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('pad-left', root, j);
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
