import jscodeshift from 'jscodeshift';
import {
	removeImport,
	transformArrayMethod,
	transformStringMethod,
} from '../shared.js';

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
		name: 'data-view-buffer',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('data-view-buffer', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const [arg, ...otherArgs] = path.node.arguments;
					if (j.Identifier.check(arg) || j.Literal.check(arg)) {
						path.replace(j.memberExpression(arg, j.identifier('buffer')));
					}
				});

			return root.toSource(options);
		},
	};
}
