import { ts } from '@ast-grep/napi';
import { findNamedDefaultImport, removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-nan';

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

			const imports = findNamedDefaultImport(root, MODULE_NAME);

			let identifierName = null;
			for (const imp of imports) {
				const nameMatch = imp.getMatch('NAME');
				if (nameMatch) {
					identifierName = nameMatch.text();
					break;
				}
			}

			if (identifierName) {
				const callExpressions = root.findAll({
					rule: {
						pattern: {
							context: `${identifierName}($VALUE)`,
							strictness: 'relaxed',
						},
					},
				});

				for (const call of callExpressions) {
					const valueMatch = call.getMatch('VALUE');
					if (valueMatch) {
						edits.push(call.replace(`Number.isNaN(${valueMatch.text()})`));
					}
				}
			}

			const { edits: importEdits } = removeImport(root, MODULE_NAME);
			edits.push(...importEdits);

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
