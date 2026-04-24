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
					const flags = extractFlags(args[1].text());
					newText = `new RegExp(${firstArg}, ${flags})`;
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

/**
 * @param {string} optionsText
 * @returns {string}
 */
function extractFlags(optionsText) {
	const flags = [];
	const flagMap = {
		global: 'g',
		ignoreCase: 'i',
		multiline: 'm',
		dotAll: 's',
		unicode: 'u',
		sticky: 'y',
	};

	const cleaned = optionsText.replace(/[{}]/g, '').trim();
	const pairs = cleaned.split(',').map((p) => p.trim());

	for (const pair of pairs) {
		const [key, value] = pair.split(':').map((s) => s.trim());
		const flag = flagMap[key];
		if (flag && value === 'true') {
			flags.push(flag);
		}
	}

	return flags.length > 0 ? `'${flags.join('')}'` : 'undefined';
}
