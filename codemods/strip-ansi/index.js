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

			for (const declaration of importDeclarations.nodes()) {
				const name = declaration.specifiers?.[0].local?.name;
				if (name) {
					importName = name;
				}
				declaration.source.value = 'node:util';
				declaration.specifiers = [j.importSpecifier(j.identifier('stripVTControlCharacters'))];
				dirtyFlag = true;
			}

			const callExpression = root.find(j.CallExpression, {
				callee: {
					type: 'Identifier',
					name: importName,
				},
			});

			for (const expression of callExpression.nodes()) {
				if (expression.callee.type === 'Identifier') {
					expression.callee.name = 'stripVTControlCharacters';
					dirtyFlag = true;
				}
			}

			return dirtyFlag ? root.toSource() : file.source;
		},
	};
}
