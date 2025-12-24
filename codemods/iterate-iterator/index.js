import { ts } from '@ast-grep/napi';
import { findNamedDefaultImport } from '../shared-ast-grep.js';

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
		name: 'iterate-iterator',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];
			const importNames = new Set();

			const imports = findNamedDefaultImport(root, 'iterate-iterator');

			for (const imp of imports) {
				const nameMatch = imp.getMatch('NAME');
				if (nameMatch) {
					importNames.add(nameMatch.text());
				}
				edits.push(imp.replace(''));
			}

			for (const importName of importNames) {
				const singleArgCalls = root.findAll({
					rule: {
						pattern: {
							context: `${importName}($ARG)`,
							strictness: 'relaxed',
						},
					},
				});

				for (const call of singleArgCalls) {
					const argMatch = call.getMatch('ARG');
					if (argMatch) {
						const replacement = `Array.from({\n  [Symbol.iterator]: () => ${argMatch.text()}\n})`;
						edits.push(call.replace(replacement));
					}
				}

				const arrowCalls = root.findAll({
					rule: {
						pattern: {
							context: `${importName}($ARG1, $PARAM => $BODY)`,
							strictness: 'relaxed',
						},
					},
					constraints: {
						PARAM: { regex: '^[^,]+$' },
					},
				});

				for (const call of arrowCalls) {
					const arg1Match = call.getMatch('ARG1');
					const paramMatch = call.getMatch('PARAM');
					const bodyMatch = call.getMatch('BODY');

					if (arg1Match && paramMatch && bodyMatch) {
						if (bodyMatch.kind() === 'statement_block') {
							continue;
						}

						const paramName = paramMatch.text().replace(/^\(|\)$/g, '');
						const bodyText = bodyMatch.text();

						const replacement = `for (const ${paramName} of {\n  [Symbol.iterator]: () => ${arg1Match.text()}\n}) {\n  ${bodyText};\n}`;
						edits.push(call.replace(replacement));
					}
				}

				const otherCalls = root.findAll({
					rule: {
						pattern: {
							context: `${importName}($ARG1, $ARG2)`,
							strictness: 'relaxed',
						},
					},
				});

				for (const call of otherCalls) {
					const arg1Match = call.getMatch('ARG1');
					const arg2Match = call.getMatch('ARG2');

					if (arg1Match && arg2Match) {
						const callback = arg2Match.text();
						const callbackKind = arg2Match.kind();

						if (callbackKind === 'arrow_function') {
							const body = arg2Match.field('body');
							if (body && body.kind() !== 'statement_block') {
								continue;
							}
						}

						const needsParens =
							callbackKind === 'function_expression' ||
							callbackKind === 'arrow_function';

						const callbackCall = needsParens
							? `(${callback})(i)`
							: `${callback}(i)`;

						const replacement = `for (const i of {\n  [Symbol.iterator]: () => ${arg1Match.text()}\n}) {\n  ${callbackCall};\n}`;
						edits.push(call.replace(replacement));
					}
				}
			}

			return root.commitEdits(edits);
		},
	};
}
