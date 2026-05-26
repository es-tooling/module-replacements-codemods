import { ts } from '@ast-grep/napi';
import { replaceDefaultImport } from '../../shared-ast-grep.js';

const MODULE_NAME = 'traverse';

/**
 * @typedef {import('../../../types.js').Codemod} Codemod
 * @typedef {import('../../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: MODULE_NAME,
		to: 'neotraverse',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits } = replaceDefaultImport(
				root,
				MODULE_NAME,
				'neotraverse/legacy',
			);

			return root.commitEdits(edits);
		},
	};
}
