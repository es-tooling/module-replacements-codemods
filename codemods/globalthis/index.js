import { ts } from '@ast-grep/napi';

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
		name: 'globalthis',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];

			const matches = root.findAll({
				rule: {
					any: [
						{
							pattern: {
								context: "const $NAME = require('globalthis')()",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "const $NAME = require('globalthis/polyfill')()",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "const $NAME = require('globalthis/shim')()",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "const $NAME = require('globalthis').shim()",
								strictness: 'relaxed',
							},
						},
					],
				},
			});

			let identifierToReplace = null;

			for (const match of matches) {
				const nameMatch = match.getMatch('NAME');
				if (nameMatch) {
					identifierToReplace = nameMatch.text();
					edits.push(match.replace(''));
				}
			}

			if (identifierToReplace) {
				const usages = root.findAll({
					rule: {
						kind: 'identifier',
						pattern: identifierToReplace,
					},
				});

				for (const usage of usages) {
					edits.push(usage.replace('globalThis'));
				}
			}

			return root.commitEdits(edits);
		},
	};
}
