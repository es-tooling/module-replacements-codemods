import { ts } from '@ast-grep/napi';
import {
	computeSimpleCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'object.values';

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

			const { edits, localNames } = removeImport(root, MODULE_NAME);

			for (const name of localNames) {
				const callEdits = computeSimpleCallReplacementEdits(
					root,
					name,
					'Object.values',
				);
				edits.push(...callEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
