import { ts } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'array.prototype.at';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @NOTE
 * `array.prototype.at` supports passing a callback, e.g.:
 * `var results = at(arr, (x, i) => x);`
 *
 * We don't support that for now, but the most common usage seems to be similar
 * to the native usage
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
					pattern: `${identifierName}($$$ARGS)`,
				},
			});

			for (const call of callExpressions) {
				const argsMatch = call.getMultipleMatches('ARGS');
				if (!argsMatch) continue;

				const args = argsMatch.filter((m) => m.kind() !== ',');

				if (args.length !== 2) continue;

				const arrayText = args[0].text();
				const indexText = args[1].text();

				edits.push(call.replace(`${arrayText}.at(${indexText})`));
			}

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
