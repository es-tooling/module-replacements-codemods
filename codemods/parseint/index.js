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
		name: 'parseint',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('parseint', root, j);

			let dirty = false;
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					// @ts-ignore
					path.node.callee.name = 'parseInt';
					dirty = true;
				});

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
