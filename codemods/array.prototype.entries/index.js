import { ts } from '@ast-grep/napi';
import { findNamedDefaultImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'array.prototype.entries';

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

			if (imports.length === 0) {
				return file.source;
			}

			let identifierName = null;
			for (const imp of imports) {
				const nameMatch = imp.getMatch('NAME');
				if (nameMatch) {
					identifierName = nameMatch.text();
					break;
				}
			}

			if (!identifierName) {
				return file.source;
			}

			const callExpressions = root.findAll({
				rule: {
					pattern: `${identifierName}($$ARG)`,
				},
			});

			for (const call of callExpressions) {
				const argNode = call.getMatch('ARG');
				if (!argNode) continue;
				const argKind = argNode.kind();

				if (argKind === 'identifier' || argKind === 'array') {
					const argText = argNode.text();
					edits.push(call.replace(`${argText}.entries()`));
				}
			}

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
