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
		name: 'array.from',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('array.from', root, j);

			root
				.find(j.CallExpression, {
					callee: { name: identifier },
				})
				.forEach((p) => {
					dirtyFlag = true;
					j(p).replaceWith(
						j.callExpression(
							j.memberExpression(j.identifier('Array'), j.identifier('from')),
							p.value.arguments,
						),
					);
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
