import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-string';

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

			const { edits, localNames } = removeImport(root, MODULE_NAME);

			if (localNames.length === 0) {
				return file.source;
			}

			for (const localName of localNames) {
				const calls = root.findAll({
					rule: {
						pattern: `${localName}($$$ARGS)`,
					},
				});

				for (const call of calls) {
					const argsMatch = call.getMultipleMatches('ARGS');
					if (!argsMatch) continue;

					const args = argsMatch.filter((m) => m.kind() !== ',');
					if (args.length !== 1) continue;

					const argText = args[0].text();
					const replacement = `Object.prototype.toString.call(${argText}) === '[object String]'`;
					edits.push(call.replace(replacement));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
