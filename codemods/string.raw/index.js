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
		name: 'string.raw',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('string.raw', root, j);
			root
				.find(j.TaggedTemplateExpression, {
					tag: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					return j.taggedTemplateExpression(
						j.memberExpression(j.identifier('String'), j.identifier('raw')),
						node.quasi,
					);
				});

			return root.toSource(options);
		},
	};
}
