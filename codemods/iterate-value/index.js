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
		name: 'iterate-value',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const imports = root.findAll({
				rule: {
					any: [
						{
							pattern: {
								context: "import $NAME from 'iterate-value'",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "const $NAME = require('iterate-value')",
								strictness: 'relaxed',
							},
						},
					],
				},
			});

			const edits = [];
			/** @type {string|null} */
			let importedName = null;

			if (imports.length === 0) {
				return file.source;
			}

			for (const node of imports) {
				if (!importedName) {
					const name = node.getMatch('NAME')?.text();

					if (name) {
						importedName = name;
					}
				}

				edits.push(node.replace(''));
			}

			const calls = root.findAll({
				rule: {
					any: [
						{
							pattern: `${importedName}($ITERABLE)`,
						},
						{
							pattern: `${importedName}($ITERABLE, $CALLBACK)`,
						},
					],
				},
			});

			for (const node of calls) {
				const iter = node.getMatch('ITERABLE');
				const callback = node.getMatch('CALLBACK');

				if (!iter) {
					continue;
				}

				if (!callback) {
					edits.push(node.replace(`Array.from(${iter.text()})`));
				} else {
					const callbackKind = callback.kind();
					const callbackBody = callback.field('body');

					if (
						(callbackKind === 'arrow_function' ||
							callbackKind === 'function_expression') &&
						callbackBody
					) {
						const params = callback.field('parameters');
						let valueName = '_value';

						if (params) {
							for (const param of params.children()) {
								const paramKind = param.kind();

								if (paramKind === 'required_parameter') {
									valueName = param.text();
									break;
								}
							}
						}

						edits.push(
							node.replace(
								`for (const ${valueName} of (${iter.text()})) ${callbackBody.text()}`,
							),
						);
					} else {
						edits.push(
							node.replace(
								`for (const value of (${iter.text()})) { ${callback.text()}(value); }`,
							),
						);
					}
				}
			}

			if (edits.length === 0) {
				return file.source;
			}

			return root.commitEdits(edits);
		},
	};
}
