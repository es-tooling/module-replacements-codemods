import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'array-buffer-byte-length';

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

				const args = argsMatch
					.filter((m) => m.kind() !== ',')
					.map((m) => m.text());

				if (args.length !== 1) continue;

				const argText = args[0];

				const isIdentifier = argText.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/);
				const isNewArrayBuffer = argText.startsWith('new ArrayBuffer');

				if (isIdentifier || isNewArrayBuffer) {
					edits.push(call.replace(`${argText}.byteLength`));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
