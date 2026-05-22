import { ts } from '@ast-grep/napi';
import {
	computeSimpleCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'object-keys';

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

			const { edits: removeEdits, localNames } = removeImport(
				root,
				MODULE_NAME,
			);
			edits.push(...removeEdits);

			const logicalMatches = root.findAll({
				rule: {
					pattern: {
						context: `var $NAME = $LEFT || require('${MODULE_NAME}')`,
						strictness: 'relaxed',
					},
				},
			});
			for (const match of logicalMatches) {
				const nameMatch = match.getMatch('NAME');
				if (nameMatch) {
					localNames.push(nameMatch.text());
					edits.push(match.replace(''));
				}
			}

			for (const name of [...new Set(localNames)]) {
				const callEdits = computeSimpleCallReplacementEdits(
					root,
					name,
					'Object.keys',
				);
				edits.push(...callEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
