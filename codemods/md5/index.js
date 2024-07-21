import jscodeshift from 'jscodeshift';
import { replaceDefaultImport } from '../shared.js';

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
		name: 'md5',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = replaceDefaultImport(
				'md5',
				'crypto',
				'crypto',
				root,
				j,
			);

			// Replace function calls
			root
				.find(j.CallExpression, {
					callee: { name: identifier },
				})
				.forEach((path) => {
					const newExpression = j.callExpression(
						j.memberExpression(
							j.callExpression(
								j.memberExpression(
									j.callExpression(
										j.memberExpression(
											j.identifier('crypto'),
											j.identifier('createHash'),
										),
										[j.literal('md5')],
									),
									j.identifier('update'),
								),
								path.node.arguments,
							),
							j.identifier('digest'),
						),
						[j.literal('hex')],
					);
					j(path).replaceWith(newExpression);
				});

			return root.toSource({ quote: 'single' });
		},
	};
}
