import { ts } from '@ast-grep/napi';
import {
	findDefaultImportIdentifier,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'date';

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

			/** @type {import('@ast-grep/napi').Edit[]} */
			const edits = [];

			const { edits: autoEdits } = removeImport(root, `${MODULE_NAME}/auto`);
			edits.push(...autoEdits);

			const { imports, identifierName } = findDefaultImportIdentifier(
				root,
				MODULE_NAME,
			);

			if (identifierName) {
				const identifiers = root.findAll({
					rule: {
						kind: 'identifier',
						regex: `^${identifierName}$`,
					},
				});
				for (const id of identifiers) {
					edits.push(id.replace('Date'));
				}

				for (const imp of imports) {
					edits.push(imp.replace(''));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
