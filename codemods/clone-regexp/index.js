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
		to: 'native',
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
					const arg = args.length >= 1 ? [args[0]] : [];
					const newRegExp = j.newExpression(j.identifier('RegExp'), arg);
					if (args.length >= 2) {
						console.warn(
							'[WARNING] Options are being passed to `clone-regexp`. Please modify the new regular expression accordingly.',
						);
						newRegExp.comments = [j.commentBlock(' Todo ', false, true)];
					}
					return newRegExp;
				})
				.toSource({ quote: 'single' });
		},
	};
}
