import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'es-get-iterator';

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
			const identifierName = localNames[0];

			if (!identifierName) {
				return edits.length > 0 ? root.commitEdits(edits) : file.source;
			}

			const calls = root.findAll({
				rule: {
					pattern: `${identifierName}($ARG)`,
				},
			});

			for (const call of calls) {
				const arg = call.getMatch('ARG');
				if (!arg) continue;

				let argText;
				if (arg.kind() === 'spread_element') {
					const inner = arg.child(0);
					argText = inner ? inner.text() : arg.text();
				} else {
					argText = arg.text();
				}

				edits.push(call.replace(`${argText}[Symbol.iterator]?.()`));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
