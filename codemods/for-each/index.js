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
		name: 'for-each',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('for-each', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const args = path.value.arguments;
					if (args.length === 2) {
						const [array, callback] = args;

						const newExpression = j.callExpression(
							//@ts-ignore
							j.memberExpression(array, j.identifier('forEach')),
							[callback],
						);
						j(path).replaceWith(newExpression);
						dirtyFlag = true;
					}
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
