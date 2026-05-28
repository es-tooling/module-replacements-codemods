import { ts } from '@ast-grep/napi';
import {
	computeCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'is-negative-zero';

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
				// Find `Object.is(...) || localName(...)` and replace with Object.is(...)
				const logicalExprs = root.findAll({
					rule: {
						pattern: `Object.is($$$ARGS) || ${localName}($$$ARGS2)`,
					},
				});

				for (const expr of logicalExprs) {
					const argsMatch = expr.getMultipleMatches('ARGS');
					if (!argsMatch) continue;
					const args = argsMatch.filter((m) => m.kind() !== ',');
					const argsText = args.map((m) => m.text()).join(', ');
					edits.push(expr.replace(`Object.is(${argsText})`));
				}

				// Find remaining localName(...) calls and replace with Object.is(arg, -0)
				const callEdits = computeCallReplacementEdits(
					root,
					localName,
					(args) => {
						if (args.length !== 1) return null;
						return `Object.is(${args[0]}, -0)`;
					},
				);
				edits.push(...callEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
