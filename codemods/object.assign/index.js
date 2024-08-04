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
		name: 'object.assign',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const identifierObjectAssign = removeImport(
				'object.assign',
				root,
				j,
			).identifier;
			const identifierPolyfill = removeImport(
				'object.assign/polyfill',
				root,
				j,
			).identifier;
			const identifierShim = removeImport(
				'object.assign/shim',
				root,
				j,
			).identifier;
			const identifier =
				identifierObjectAssign || identifierPolyfill || identifierShim;

			if (identifier) {
				root
					.find(j.Identifier, { name: identifier })
					.replaceWith(j.identifier('Object.assign'));
			}

			return root.toSource({ quote: 'single' });
		},
	};
}
