import { ts } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'array-map';

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

			const callExpressions = root.findAll({
				rule: {
					pattern: `${identifierName}($$$ARG)`,
				},
			});

			for (const call of callExpressions) {
				const argsMatch = call.getMultipleMatches('ARG');
				if (!argsMatch) continue;

				const argNodes = argsMatch.filter((m) => m.kind() !== ',');

				if (argNodes.length !== 2) continue;
				const arrayText = argNodes[0].text();
				const callbackText = argNodes[1].text();
				edits.push(call.replace(`${arrayText}.map(${callbackText})`));
			}

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
