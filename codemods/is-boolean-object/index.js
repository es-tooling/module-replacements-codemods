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
		name: 'is-boolean-object',
		transform: ({ file, jscodeshift }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			// Find all require statements for 'is-boolean-object'
			root
				.find(j.VariableDeclaration)
				.filter((path) =>
					path.value.declarations.some(
						(decl) =>
							j.VariableDeclarator.check(decl) &&
							decl.init &&
							j.CallExpression.check(decl.init) &&
							j.Identifier.check(decl.init.callee) &&
							decl.init.callee.name === 'require' &&
							decl.init.arguments.length > 0 &&
							j.Literal.check(decl.init.arguments[0]) &&
							decl.init.arguments[0].value === 'is-boolean-object',
					),
				)
				.forEach((path) => {
					// Remove the require statement for 'is-boolean-object'
					path.prune();
					dirtyFlag = true;
				});

			// Remove ESM import statement for 'is-boolean-object'
			root
				.find(j.ImportDeclaration, {
					source: { value: 'is-boolean-object' },
				})
				.forEach((path) => {
					j(path).remove();
					dirtyFlag = true;
				});

			// Replace all calls to isBoolean with Object.prototype.toString.call
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: 'isBoolean',
					},
				})
				.replaceWith((path) => {
					const arg = path.node.arguments[0];
					return j.callExpression(
						j.memberExpression(
							j.memberExpression(
								j.memberExpression(
									j.identifier('Object'),
									j.identifier('prototype'),
								),
								j.identifier('toString'),
							),
							j.identifier('call'),
						),
						[arg],
					);
				})
				.forEach((path) => {
					const parent = path.parent.node;
					if (j.BinaryExpression.check(parent)) {
						parent.operator = '===';
						parent.right = j.literal('[object Boolean]');
					} else if (
						j.CallExpression.check(parent) &&
						parent.arguments.length === 1
					) {
						const newExpression = j.binaryExpression(
							'===',
							path.node,
							j.literal('[object Boolean]'),
						);
						parent.arguments[0] = newExpression;
					}
				});

			return dirtyFlag ? root.toSource({ quote: 'single' }) : file.source;
		},
	};
}
