import { ts } from '@ast-grep/napi';
import {
	computeSimpleCallReplacementEdits,
	findDefaultImportIdentifier,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'gopd';
const REPLACEMENT = 'Object.getOwnPropertyDescriptor';

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

			const { identifierName } = findDefaultImportIdentifier(root, MODULE_NAME);

			if (!identifierName) {
				return file.source;
			}

			const edits = computeSimpleCallReplacementEdits(
				root,
				identifierName,
				REPLACEMENT,
			);

			// TODO (jg): do we actually need this? seems to be an edge case
			// and/or to satisfy the tests
			for (const typeofExpr of root.findAll({
				rule: { pattern: `typeof ${identifierName}` },
			})) {
				edits.push(typeofExpr.replace(`typeof ${REPLACEMENT}`));
			}

			const { edits: importEdits } = removeImport(root, MODULE_NAME);
			edits.push(...importEdits);

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
