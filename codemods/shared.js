/**
 * @param {string} name - package name to remove import/require calls for
 * @param {any} root - package name to remove import/require calls for
 * @param {any} j - jscodeshift instance
 */
export function removeImport(name, root, j) {
	// Find the import or require statement for 'is-boolean-object'
	const importDeclaration = root.find(j.ImportDeclaration, {
		source: {
			value: name,
		},
	});

	const requireDeclaration = root.find(j.VariableDeclarator, {
		init: {
			callee: {
				name: 'require',
			},
			arguments: [
				{
					value: name,
				},
			],
		},
	});

	importDeclaration.remove();
	requireDeclaration.remove();
}
