import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @NOTE
 * `for-each` also supports passing objects to it, but this can't always be statically
 * analyzed. This codemod assumes usage of `for-each` on arrays only.
 *
 * If a project does use `for-each` on an object, you can replace it with `Object.entries(obj).forEach`
 *
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'string.prototype.matchall',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('string.prototype.matchall', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					const args = node.arguments;
					if (args.length === 2) {
						const [string, ...otherArgs] = args;

						return j.callExpression(
							//@ts-ignore
							j.memberExpression(string, j.identifier('matchAll')),
							otherArgs,
						);
					}
				});

			return root.toSource(options);
		},
	};
}
