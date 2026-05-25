import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'object.keys';

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
		name: MODULE_NAME,
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits } = removeImport(root, MODULE_NAME);

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
