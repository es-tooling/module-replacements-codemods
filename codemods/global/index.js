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
		name: 'global',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const globalIdentifier = removeImport('global', root, j).identifier;
			const documentIdentifier = removeImport(
				'global/document',
				root,
				j,
			).identifier;
			const windowIdentifier = removeImport(
				'global/window',
				root,
				j,
			).identifier;

			root
				.find(j.Identifier, { name: globalIdentifier })
				.replaceWith(j.identifier('globalThis'));
			root
				.find(j.Identifier, { name: documentIdentifier })
				.replaceWith(j.identifier('document'));
			root
				.find(j.Identifier, { name: windowIdentifier })
				.replaceWith(j.identifier('window'));

			return root.toSource({ quote: 'single' });
		},
	};
}
