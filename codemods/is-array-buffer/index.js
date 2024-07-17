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
		name: 'is-array-buffer',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			removeImport('is-array-buffer', root, j);

			// Replace isArrayBuffer calls with (foo instanceof ArrayBuffer)
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: 'isArrayBuffer',
					},
				})
				.forEach((path) => {
					const args = path.value.arguments;
					if (args.length === 1) {
						const arg = args[0];
						const newExpression = j.binaryExpression(
							'instanceof',
							// @ts-expect-error
							arg,
							j.identifier('ArrayBuffer'),
						);
						const wrappedExpression = j.parenthesizedExpression(newExpression);
						j(path).replaceWith(wrappedExpression);
						dirtyFlag = true;
					}
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
