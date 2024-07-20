/**
 * type definition for return type object
 * @typedef {Object} RemoveImport
 * @property {string} identifier - the name of the module as it was imported or required. for example, `keys` in `import keys from 'object-keys'`
 */

/**
 * @param {string} name - package name to remove import/require calls for
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {RemoveImport}
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

	// Require statements without declarations like `Object.is = require("object-is");`
	const requireAssignment = root.find(j.AssignmentExpression, {
		operator: '=',
		right: {
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

	// Return the identifier name, e.g. 'fn' in `import { fn } from 'is-boolean-object'`
	// or `var fn = require('is-boolean-object')`
	const identifier =
		importDeclaration.paths().length > 0
			? importDeclaration.get().node.specifiers[0].local.name
			: requireDeclaration.paths().length > 0
				? requireDeclaration.find(j.Identifier).get().node.name
				: requireAssignment.paths().length > 0
					? requireAssignment.find(j.Identifier).get().node.name
					: null;

	importDeclaration.remove();
	requireDeclaration.remove();
	requireAssignment.remove();

	return { identifier };
}

/**
 * @param {string} method - e.g. `array.prototype.flatMap`
 * @param {string} identifierName - e.g. `flatMap`
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns
 */
export function transformArrayMethod(method, identifierName, root, j) {
	const { identifier } = removeImport(method, root, j);

	let dirtyFlag = false;
	root
		.find(j.CallExpression, {
			callee: {
				type: 'Identifier',
				name: identifier,
			},
		})
		.forEach((path) => {
			const [arrayArg, ...otherArgs] = path.node.arguments;
			if (j.Identifier.check(arrayArg) || j.ArrayExpression.check(arrayArg)) {
				path.replace(
					j.callExpression(
						j.memberExpression(arrayArg, j.identifier(identifierName)),
						otherArgs,
					),
				);
				dirtyFlag = true;
			}
		});

	return dirtyFlag;
}
