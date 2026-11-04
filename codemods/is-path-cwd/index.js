import { Lang, parse } from '@ast-grep/napi';
import {
	computeCallReplacementEdits,
	replaceDefaultWithNamedImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'is-path-cwd';

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

			const { edits, localNames } = replaceDefaultWithNamedImport(
				root,
				MODULE_NAME,
				'node:path',
				'relative',
			);

			if (localNames.length === 0) {
				return file.source;
			}

			for (const identifierName of localNames) {
				const callEdits = computeCallReplacementEdits(
					root,
					identifierName,
					(args) => {
						if (args.length !== 1) return null;
						return `!relative(${args[0]}, process.cwd())`;
					},
				);
				edits.push(...callEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
