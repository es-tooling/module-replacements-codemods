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

			importDeclarations.forEach((declaration) => {
				const name = declaration.value.specifiers?.[0].local?.name;
				if (name) {
					importName = name;
				}
				declaration.value.source.value = 'node:util';
				declaration.value.specifiers = [j.importSpecifier(j.identifier('stripVTControlCharacters'))];
				dirtyFlag = true;
			});

			root.find(j.CallExpression, {
				callee: {
					name: importName,
				}
			}).forEach((expression) => {
				expression.value.callee.name = 'stripVTControlCharacters';
				dirtyFlag = true;
			});

			return dirtyFlag ? root.toSource() : file.source;
		},
	};
}
