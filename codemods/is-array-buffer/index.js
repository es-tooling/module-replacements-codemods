import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-array-buffer',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('is-array-buffer', root, j);

			// Replace isArrayBuffer calls with (foo instanceof ArrayBuffer)
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
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
