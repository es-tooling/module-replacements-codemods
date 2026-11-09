import { Lang, parse } from '@ast-grep/napi';
import {
	computeCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'has-symbols';

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
			const shams = removeImport(root, `${MODULE_NAME}/shams`);
			edits.push(...shams.edits);

			for (const name of [...localNames, ...shams.localNames]) {
				edits.push(...computeCallReplacementEdits(root, name, () => 'true'));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
