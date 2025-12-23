import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'string.raw',
		to: 'native',
		transform: ({ file, options }) => {
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
