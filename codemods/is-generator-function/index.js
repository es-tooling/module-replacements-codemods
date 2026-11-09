import { Lang, parse } from '@ast-grep/napi';
import {
	computeCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'is-generator-function';

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

			for (const identifierName of localNames) {
				const callEdits = computeCallReplacementEdits(
					root,
					identifierName,
					(args) => {
						if (args.length !== 1) return null;
						return `(typeof ${args[0]} === 'function' && Object.prototype.toString.call(${args[0]}) === '[object GeneratorFunction]')`;
					},
				);
				edits.push(...callEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
