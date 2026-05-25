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
		name: 'is-builtin-module',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const importDeclarations = root.findAll({
				rule: {
					pattern: {
						context: `import $NAME from 'is-builtin-module'`,
						strictness: 'relaxed',
					},
				},
			});

			const requireDeclarations = root.findAll({
				rule: {
					any: [
						{
							pattern: {
								context: `const $NAME = require('is-builtin-module')`,
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: `var $NAME = require('is-builtin-module')`,
								strictness: 'relaxed',
							},
						},
					],
				},
			});

			if (importDeclarations.length >= 1 && requireDeclarations.length >= 1) {
				console.warn(
					'[WARNING] Refusing to replace `is-builtin-module` because the code mixes import and require statements. Please only use either `import` or `require` and re-run this codemod.',
				);
				return file.source;
			}

			if (importDeclarations.length > 1 || requireDeclarations.length > 1) {
				console.warn(
					'[WARNING] Refusing to replace `is-builtin-module` because it is imported multiple times. Please import it only once and re-run this codemod.',
				);
				return file.source;
			}

			const edits = [];
			let importName = 'isBuiltin';

			for (const imp of importDeclarations) {
				const nameMatch = imp.getMatch('NAME');
				if (nameMatch) {
					importName = nameMatch.text();
				}
				edits.push(imp.replace(`import { isBuiltin } from 'node:module'`));
			}

			for (const req of requireDeclarations) {
				const nameMatch = req.getMatch('NAME');
				if (nameMatch) {
					importName = nameMatch.text();
				}
				edits.push(req.replace(`const { isBuiltin } = require('node:module')`));
			}

			if (importName !== 'isBuiltin') {
				const calls = root.findAll({
					rule: { pattern: `${importName}($$$ARGS)` },
				});
				for (const call of calls) {
					const argsMatch = call.getMultipleMatches('ARGS');
					const argsText = argsMatch
						? argsMatch
								.filter((m) => m.kind() !== ',')
								.map((m) => m.text())
								.join(', ')
						: '';
					edits.push(call.replace(`isBuiltin(${argsText})`));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
