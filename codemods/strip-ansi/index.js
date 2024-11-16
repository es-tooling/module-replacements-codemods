import jscodeshift from 'jscodeshift';

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
		name: 'strip-ansi',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const importDeclarations = root.find(j.ImportDeclaration, {
				source: {
					value: 'strip-ansi',
				},
			});

			let importName = 'stripAnsi';

			for (const declaration of importDeclarations) {
				const name = declaration.value.specifiers?.[0].local?.name;
				if (name) {
					importName = name;
				}
				path.value.source.value = 'node:util';
				path.value.specifiers = [j.importSpecifier(j.identifier('stripVTControlCharacters'))];
				dirtyFlag = true;
			}

			const callExpressions = root.find(j.CallExpression, {
				callee: {
					name: importName,
				}
			});

			for (const expression of callExpressions) {
				expression.value.callee.name = 'stripVTControlCharacters';
				dirtyFlag = true;
			}

			return dirtyFlag ? root.toSource() : file.source;
		},
	};
}
