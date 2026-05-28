import { ts } from '@ast-grep/napi';
import {
	computeCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'array-buffer-byte-length';

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

			for (const identifierName of localNames) {
				const callEdits = computeCallReplacementEdits(
					root,
					identifierName,
					(args) => {
						if (args.length !== 1) return null;
						return `${args[0]}.byteLength`;
					},
				);
				edits.push(...callEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
