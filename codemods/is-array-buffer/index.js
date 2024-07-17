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
		name: 'is-array-buffer',
		transform: ({ file, jscodeshift }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			// Remove the require statement for 'is-array-buffer'
			root.find(j.VariableDeclaration).forEach((path) => {
				const declarations = path.value.declarations;
				if (
					declarations.length === 1 &&
					j.VariableDeclarator.check(declarations[0])
				) {
					const declarator = declarations[0];
					if (
						j.CallExpression.check(declarator.init) &&
						j.Identifier.check(declarator.id)
					) {
						const callExpr = declarator.init;
						if (
							j.Identifier.check(callExpr.callee) &&
							callExpr.callee.name === 'require'
						) {
							const args = callExpr.arguments;
							if (
								args.length === 1 &&
								j.Literal.check(args[0]) &&
								args[0].value === 'is-array-buffer'
							) {
								j(path).remove();
								dirtyFlag = true;
							}
						}
					}
				}
			});

			// Remove ESM import statement for 'is-array-buffer'
			root
				.find(j.ImportDeclaration, {
					source: { value: 'is-array-buffer' },
				})
				.forEach((path) => {
					j(path).remove();
					dirtyFlag = true;
				});

			// Replace isArrayBuffer calls with (foo instanceof ArrayBuffer)
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: 'isArrayBuffer',
					},
				})
				.forEach((path) => {
					const args = path.value.arguments;
					if (args.length === 1) {
						const arg = args[0];
						const newExpression = j.binaryExpression(
							'instanceof',
							// @ts-expect-error
							arg,
							j.identifier('ArrayBuffer'),
						);
						j(path).replaceWith(newExpression);
						dirtyFlag = true;
					}
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
