import { ts } from '@ast-grep/napi';
import { findNamedDefaultImport } from '../shared-ast-grep.js';

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
					pattern: `${identifierName}($$$ARGS)`,
				},
			});

			for (const call of callExpressions) {
				const argsMatch = call.getMultipleMatches('ARGS');
				if (argsMatch) {
					const args = argsMatch.filter((m) => m.kind() !== ',');
					if (args.length === 2) {
						const arrayText = args[0].text();
						const fnText = args[1].text();
						edits.push(call.replace(`${arrayText}.every(${fnText})`));
					}
				}
			}

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
