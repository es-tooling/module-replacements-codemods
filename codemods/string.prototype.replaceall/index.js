import { Lang, parse } from '@ast-grep/napi';
import {
	computePolyfillMethodCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'string.prototype.replaceall';

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
			const ast = parse(Lang.TypeScript, file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, MODULE_NAME);

			for (const name of localNames) {
				const callEdits = computePolyfillMethodCallReplacementEdits(
					root,
					name,
					'replaceAll',
					(args) => args.length >= 1,
				);
				edits.push(...callEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
