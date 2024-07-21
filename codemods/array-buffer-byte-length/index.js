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
		name: 'array-buffer-byte-length',
		transform: ({ file }) => {
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
