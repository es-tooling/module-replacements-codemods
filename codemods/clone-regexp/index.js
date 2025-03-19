import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'clone-regexp',
		transform: ({ file, options }) => {
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
				.toSource(options);
		},
	};
}
