import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

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
		name: 'split-lines',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, 'split-lines');

			for (const name of localNames) {
				const calls = root.findAll({
					rule: {
						pattern: `${name}($$$ARGS)`,
					},
				});

				for (const call of calls) {
					const argsMatch = call.getMultipleMatches('ARGS');
					if (!argsMatch) continue;

					const args = argsMatch.filter((m) => m.kind() !== ',');
					if (args.length < 1 || args[0].kind() !== 'string') continue;

					const stringArg = args[0];

					if (args.length >= 2) {
						const optsArg = args[1];
						if (optsArg.kind() !== 'object') continue;

						const hasPreserveNewlines = optsArg
							.text()
							.includes('preserveNewlines');

						if (hasPreserveNewlines) {
							edits.push(
								call.replace(
									`${stringArg.text()}.split(/(\\r?\\n)/).reduce((acc, part, index, array) => {
  if (index % 2 === 0) {
    acc.push(part + (array[index + 1] || ""));
  }

  return acc;
}, [])`,
								),
							);
							continue;
						}
					}

					edits.push(call.replace(`${stringArg.text()}.split(/\\r?\\n/)`));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
