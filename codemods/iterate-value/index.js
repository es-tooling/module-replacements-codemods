import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'iterate-value';

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

			for (const importedName of localNames) {
				const calls = root.findAll({
					rule: {
						any: [
							{ pattern: `${importedName}($ITERABLE)` },
							{ pattern: `${importedName}($ITERABLE, $CALLBACK)` },
						],
					},
				});

				for (const node of calls) {
					const iter = node.getMatch('ITERABLE');
					if (!iter) continue;

					const callback = node.getMatch('CALLBACK');

					if (!callback) {
						edits.push(node.replace(`Array.from(${iter.text()})`));
						continue;
					}

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
