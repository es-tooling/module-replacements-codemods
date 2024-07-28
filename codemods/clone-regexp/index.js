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
		name: 'clone-regexp',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('clone-regexp', root, j);

			return root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith((path) => {
					const args = path.node.arguments;
					if (args.length === 0) {
						return j.newExpression(j.identifier('RegExp'), []);
					}
					if (args.length === 1) {
						return j.newExpression(j.identifier('RegExp'), [args[0]]);
					}
					if (args.length === 2) {
						const newExpression = j.newExpression(j.identifier('RegExp'), [
							args[0],
						]);
						newExpression.comments = [j.commentBlock(' Todo ', false, true)];
						return newExpression;
					}
				})
				.toSource({ quote: 'single' });
		},
	};
}
