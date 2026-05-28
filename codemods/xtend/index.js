import { ts } from '@ast-grep/napi';
import {
	computeCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

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
		name: 'xtend',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, 'xtend');

			if (localNames.length === 0) {
				return file.source;
			}

			const identifierName = localNames[0];
			const callEdits = computeCallReplacementEdits(
				root,
				identifierName,
				(args) => {
					const spreadArgs = args.map((a) => `...${a}`);
					return `{ ${spreadArgs.join(', ')} }`;
				},
			);
			edits.push(...callEdits);

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
