import { ts } from '@ast-grep/napi';
import {
	findDefaultImportIdentifier,
	replaceCallExpressions,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'array-every';

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
			const edits = [];

			const { imports, identifierName } = findDefaultImportIdentifier(
				root,
				MODULE_NAME,
			);

			if (!identifierName) {
				return file.source;
			}

			const callEdits = replaceCallExpressions(
				root,
				identifierName,
				'every',
				(args) => args.length >= 2,
			);

			edits.push(...callEdits);

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
