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
		name: 'is-builtin-module',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const importDeclaration = root.find(j.ImportDeclaration, {
				source: { value: 'is-builtin-module' },
			});

			const requireDeclaration = root.find(j.VariableDeclarator, {
				init: {
					callee: {
						name: 'require',
					},
					arguments: [
						{
							value: 'is-builtin-module',
						},
					],
				},
			});

			// These cases are too complex and too niche to handle
			if (importDeclaration.size() >= 1 && requireDeclaration.size() >= 1) {
				console.warn(
					'[WARNING] Refusing to replace `is-builtin-module` because the code mixes import and require statements. Please only use either `import` or `require` and re-run this codemod.',
				);
				return file.source;
			}

			if (importDeclaration.size() > 1 || requireDeclaration.size() > 1) {
				console.warn(
					'[WARNING] Refusing to replace `is-builtin-module` because it is imported multiple times. Please import it only once and re-run this codemod.',
				);
				return file.source;
			}

			let importName = 'isBuiltin';

			// Replace import statement
			importDeclaration.forEach((path) => {
				const name = path.value.specifiers?.[0].local?.name;
				if (name && typeof name === 'string') {
					importName = name;
				}
				path.value.source.value = 'node:module';
				path.value.specifiers = [j.importSpecifier(j.identifier('isBuiltin'))];
				dirtyFlag = true;
			});

			// Replace require statement
			requireDeclaration.forEach((path) => {
				// @ts-expect-error
				importName = path.value.id.name;
				path.value.id = j.objectPattern.from({
					properties: [
						j.property.from({
							key: j.identifier('isBuiltin'),
							value: j.identifier('isBuiltin'),
							shorthand: true,
							kind: 'init',
						}),
					],
				});
				// @ts-expect-error
				path.value.init.arguments[0].value = 'node:module';
				dirtyFlag = true;
			});

			// Replace function calls
			root
				.find(j.CallExpression, {
					callee: { name: importName },
				})
				.forEach((path) => {
					// @ts-expect-error
					path.value.callee.name = 'isBuiltin';
					dirtyFlag = true;
				});

			return dirtyFlag ? root.toSource() : file.source;
		},
	};
}
