import { ts } from '@ast-grep/napi';
import {
	computePolyfillMethodCallReplacementEdits,
	findDefaultImportIdentifier,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'for-each';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @NOTE
 * `for-each` also supports passing objects to it, but this can't always be statically
 * analyzed. This codemod assumes usage of `for-each` on arrays only.
 *
 * If a project does use `for-each` on an object, you can replace it with `Object.entries(obj).forEach`
 *
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

			const { imports, identifierName } = findDefaultImportIdentifier(
				root,
				MODULE_NAME,
			);

			if (!identifierName) {
				return file.source;
			}

			const edits = computePolyfillMethodCallReplacementEdits(
				root,
				identifierName,
				'forEach',
				(args) => args.length === 2,
			);

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
