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
		name: 'globalthis',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const identifier1 = removeImport('globalthis', root, j).identifier;
			const identifier2 = removeImport(
				'globalthis/polyfill',
				root,
				j,
			).identifier;
			const identifier3 = removeImport('globalthis/shim', root, j).identifier;
			const identifier = identifier1 || identifier2 || identifier3;

			if (identifier) {
				root
					.find(j.Identifier, { name: identifier })
					.replaceWith(j.identifier('globalThis'));
			}

			return root.toSource({ quote: 'single' });
		},
	};
}
