import { ts } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'clone-regexp';

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
					pattern: `${identifierName}($$$ARGS)`,
				},
			});

			for (const call of callExpressions) {
				const argsMatch = call.getMultipleMatches('ARGS');
				if (!argsMatch) continue;

				const args = argsMatch.filter((m) => m.kind() !== ',');

				const firstArg = args.length >= 1 ? args[0].text() : '';
				const hasSecondArg = args.length >= 2;

				let newText = '';
				if (hasSecondArg) {
					const flags = extractFlagsFromNode(args[1]);
					if (flags) {
						newText = `new RegExp(${firstArg}, '${flags}')`;
					} else {
						newText = `new RegExp(${firstArg})`;
						console.warn(
							'[WARNING] Options are being passed to `clone-regexp`. Please modify the new regular expression accordingly.',
						);
					}
				} else {
					newText = `new RegExp(${firstArg})`;
				}

				edits.push(call.replace(newText));
			}

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}

const FLAG_MAP = {
	global: 'g',
	ignoreCase: 'i',
	multiline: 'm',
	dotAll: 's',
	unicode: 'u',
	sticky: 'y',
};

/**
 * @param {import('@ast-grep/napi').SgNode} node
 * @returns {string | null}
 */
function extractFlagsFromNode(node) {
	/** @type {string[]} */
	const flags = [];

	for (const [flagName, flagChar] of Object.entries(FLAG_MAP)) {
		const propMatch = node.find({
			rule: {
				pattern: {
					context: `{ ${flagName}: true }`,
					strictness: 'smart',
				},
			},
		});

		if (propMatch) {
			flags.push(flagChar);
		}
	}

	return flags.length > 0 ? flags.join('') : null;
}
