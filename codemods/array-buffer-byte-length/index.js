import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'array-buffer-byte-length',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('array-buffer-byte-length', root, j);

			let dirtyFlag = false;
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const [bufferArg] = path.node.arguments;
					if (
						j.Identifier.check(bufferArg) ||
						(j.NewExpression.check(bufferArg) &&
							bufferArg.callee.type === 'Identifier' &&
							bufferArg.callee.name === 'ArrayBuffer')
					) {
						path.replace(
							j.memberExpression(bufferArg, j.identifier('byteLength')),
						);
						dirtyFlag = true;
					}
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
