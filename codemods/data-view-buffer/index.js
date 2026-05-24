import { ts } from '@ast-grep/napi';
import {
	computePolyfillPropertyReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'data-view-buffer';
const PROPERTY_NAME = 'buffer';

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
				const propEdits = computePolyfillPropertyReplacementEdits(
					root,
					name,
					PROPERTY_NAME,
				);
				edits.push(...propEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
