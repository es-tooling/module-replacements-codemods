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
		name: 'number.isnan',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			let { identifier } = removeImport('number.isnan', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					return j.callExpression(
						j.memberExpression(j.identifier('Number'), j.identifier('isNaN')),
						node.arguments,
					);
				});

			return root.toSource(options);
		},
	};
}
