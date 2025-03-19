import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'array.prototype.entries',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('array.prototype.entries', root, j);

			root
				.find(j.CallExpression, {
					callee: { name: identifier },
				})
				.forEach((path) => {
					const { arguments: args } = path.node;

					// Ensure the call expression has exactly one argument
					if (args.length === 1) {
						const arg = args[0];

						// Check if the argument is an array expression or an identifier
						if (j.ArrayExpression.check(arg) || j.Identifier.check(arg)) {
							// Replace the call expression with a method call on the argument
							j(path).replaceWith(
								j.callExpression(
									j.memberExpression(arg, j.identifier('entries')),
									[],
								),
							);
							dirtyFlag = true;
						}
					}
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
