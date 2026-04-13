import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

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
		name: 'abort-controller',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits } = removeImport(root, 'abort-controller');

			if (edits.length === 0) {
				return file.source;
			}

			return root.commitEdits(edits);
		},
	};
}
