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
		name: 'is-plain-object',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, 'is-plain-object');

			for (const name of localNames) {
				const calls = root.findAll({
					rule: { pattern: `${name}($$$ARGS)` },
				});
				for (const call of calls) {
					const argsMatch = call.getMultipleMatches('ARGS');
					if (!argsMatch) continue;

					const args = argsMatch.filter((m) => m.kind() !== ',');
					if (args.length === 0) continue;

					const firstArg = args[0].text();
					const replacement = `(v => {\n    return !!(v && (typeof v === "object" && (Object.getPrototypeOf(v) === null || Object.getPrototypeOf(v) === Object.prototype)));\n})(${firstArg})`;
					edits.push(call.replace(replacement));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
