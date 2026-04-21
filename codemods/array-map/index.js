import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'array-map';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (_options) {
	return {
		name: MODULE_NAME,
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];

			const { edits: importEdits, localNames } = removeImport(
				root,
				MODULE_NAME,
			);

			if (localNames.length === 0) {
				return file.source;
			}

			edits.push(...importEdits);

			const identifierName = localNames[0];

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

				const arrayArgNode = argNodes[0];
				const callbackArgNode = argNodes[1];

				const isIdentifier = arrayArgNode.kind() === 'identifier';
				const isArray = arrayArgNode.kind() === 'array';

				if (isIdentifier || isArray) {
					const arrayText = arrayArgNode.text();
					const callbackText = callbackArgNode.text();
					edits.push(call.replace(`${arrayText}.map(${callbackText})`));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
