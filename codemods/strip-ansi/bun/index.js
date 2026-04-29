import { ts } from '@ast-grep/napi';
import {
	computeSimpleCallReplacementEdits,
	replaceDefaultWithNamedImport,
} from '../../shared-ast-grep.js';

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
		name: 'strip-ansi-bun',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = replaceDefaultWithNamedImport(
				root,
				'strip-ansi',
				'bun',
				'stripANSI',
			);

			for (const importName of localNames) {
				const callEdits = computeSimpleCallReplacementEdits(
					root,
					importName,
					'stripANSI',
				);
				edits.push(...callEdits);
			}

			return root.commitEdits(edits);
		},
	};
}
