import { ts } from '@ast-grep/napi';
import { replaceDefaultImport } from '../shared-ast-grep.js';

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
		name: 'invariant',
		to: 'tiny-invariant',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits } = replaceDefaultImport(
				root,
				'invariant',
				'tiny-invariant',
			);

			return root.commitEdits(edits);
		},
	};
}
