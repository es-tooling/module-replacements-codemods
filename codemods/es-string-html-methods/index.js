import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

const methods = [
	'anchor',
	'big',
	'blink',
	'bold',
	'fixed',
	'fontcolor',
	'fontsize',
	'italics',
	'link',
	'small',
	'strike',
	'sub',
	'sup',
];

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'es-string-html-methods',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];

			/** @type {Record<string,string>} */
			const methodIdentifiers = {};

			for (const method of methods) {
				const { edits: removeEdits, localNames } = removeImport(
					root,
					`es-string-html-methods/${method}`,
				);
				edits.push(...removeEdits);
				if (localNames[0]) {
					methodIdentifiers[method] = localNames[0];
				}
			}

			for (const method of methods) {
				const { edits: removeAutoEdits } = removeImport(
					root,
					`es-string-html-methods/${method}/auto`,
				);
				edits.push(...removeAutoEdits);
			}

			const { edits: removeGlobalAutoEdits } = removeImport(
				root,
				'es-string-html-methods/auto',
			);
			edits.push(...removeGlobalAutoEdits);

			for (const [method, identifierName] of Object.entries(
				methodIdentifiers,
			)) {
				const calls = root.findAll({
					rule: {
						pattern: `${identifierName}($$$ARGS)`,
					},
				});

				for (const call of calls) {
					const argsMatch = call.getMultipleMatches('ARGS');
					if (!argsMatch) continue;

					const args = argsMatch.filter((m) => m.kind() !== ',');

					if (args.length === 0) continue;

					const firstArg = args[0];
					if (firstArg.kind() === 'spread_element') continue;

					const target = firstArg.text();
					const methodArgs = args
						.slice(1)
						.map((m) => m.text())
						.join(', ');

					edits.push(
						call.replace(
							`${target}.${method}${methodArgs ? `(${methodArgs})` : '()'}`,
						),
					);
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
