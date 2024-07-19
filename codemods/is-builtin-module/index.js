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
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			// Replace import statement
			root
				.find(j.ImportDeclaration, {
					source: { value: 'is-builtin-module' },
				})
				.forEach((path) => {
					path.value.source.value = 'node:module';
					path.value.specifiers = [
						j.importSpecifier(j.identifier('isBuiltin')),
					];
					dirtyFlag = true;
				});

			// Replace function calls
			root
				.find(j.CallExpression, {
					callee: { name: 'isBuiltinModule' },
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
