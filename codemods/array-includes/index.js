import { ts } from '@ast-grep/napi';
import { findCallExpressionsAndIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'array-includes';

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

			const { callExpressions, identifierName, imports } =
				findCallExpressionsAndIdentifier(root, MODULE_NAME);

			if (!identifierName) {
				return file.source;
			}

			for (const call of callExpressions) {
				const argsMatch = call.getMultipleMatches('ARGS');
				if (argsMatch) {
					const args = argsMatch.filter((m) => m.kind() !== ',');
					if (args.length >= 2) {
						const arrayText = args[0].text();
						const searchArgs = args
							.slice(1)
							.map((m) => m.text())
							.join(', ');
						edits.push(call.replace(`${arrayText}.includes(${searchArgs})`));
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
