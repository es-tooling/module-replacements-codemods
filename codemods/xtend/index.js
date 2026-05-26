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
		name: 'xtend',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, 'xtend');

			if (localNames.length === 0) {
				return file.source;
			}

			const identifierName = localNames[0];
			const calls = root.findAll({
				rule: {
					pattern: `${identifierName}($$$ARGS)`,
				},
			});

			for (const call of calls) {
				const argsMatch = call.getMultipleMatches('ARGS');
				if (!argsMatch) continue;

				const args = argsMatch.filter((m) => m.kind() !== ',');
				const spreadArgs = args.map((a) => `...${a.text()}`);
				edits.push(call.replace(`{ ${spreadArgs.join(', ')} }`));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
