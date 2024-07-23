/**
 * type definition for return type object
 * @typedef {Object} RemoveImport
 * @property {string} identifier - the name of the module as it was imported or required. for example, `keys` in `import keys from 'object-keys'`
 * @typedef {Object} ReplaceDefaultImport
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

	// Side effect requires statements like `require("error-cause/auto");`
	const sideEffectRequireExpression = root.find(j.ExpressionStatement, {
		expression: {
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
	sideEffectRequireExpression.remove();

	return { identifier };
}

export const DEFAULT_IMPORT = Symbol('DEFAULT_IMPORT');
export const NAMESPACE_IMPORT = Symbol('NAMESPACE_IMPORT');

/**
 * Analyzes an `import` or `require` statement to detect which names are being
 * imported and what identifiers is the developer assigning them to. Returns a
 * map with the package exports as keys and developer-assigned names as values.
 *
 * The map may optionally contain the special symbol {@link DEFAULT_IMPORT} if
 * the package is imported like:
 *
 *   - import a from 'pkg'
 *   or
 *   - import a, { b } from 'pkg'
 *
 * The map may optionally contain the special symbol {@link NAMESPACE_IMPORT}
 * if the package is imported like:
 *
 *   - import * as a from 'pkg'
 *
 * @param {string} packageName - package name to retrieve its identifier map
 * @param {import("jscodeshift").Collection} root - jcodeshift tree of the file containing the import
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 */
export function getImportIdentifierMap(packageName, root, j) {
	/**
	 * @type {Record<string, string | undefined> & {
	 *   [DEFAULT_IMPORT]?: string
	 *   [NAMESPACE_IMPORT]?: string
	 * }}
	 */
	const map = {};

	// Scan named imports e.g.
	// import { x as a, y as b } from 'pkg'
	root
		.find(j.ImportDeclaration, {
			source: {
				value: packageName,
			},
		})
		.forEach((path) => {
			if (path.value.type !== 'ImportDeclaration') return;
			path.value.specifiers?.forEach((specifier) => {
				if (!specifier.local) return;

				if (specifier.type === 'ImportSpecifier') {
					map[specifier.imported.name] = specifier.local.name;
				} else if (specifier.type === 'ImportDefaultSpecifier') {
					map[DEFAULT_IMPORT] = specifier.local.name;
				} else if (specifier.type === 'ImportNamespaceSpecifier') {
					map[NAMESPACE_IMPORT] = specifier.local.name;
				}
			});
		});

	// Scan require imports e.g.
	// var { x: a } = require('pkg')
	root
		.find(j.VariableDeclarator, {
			init: {
				callee: {
					name: 'require',
				},
				arguments: [
					{
						value: packageName,
					},
				],
			},
		})
		.forEach((path) => {
			if (path.value.id.type === 'Identifier') {
				map[DEFAULT_IMPORT] = path.value.id.name;
				map[NAMESPACE_IMPORT] = path.value.id.name;
			} else if (path.value.id.type === 'ObjectPattern') {
				path.value.id.properties.forEach((property) => {
					if (
						property.type !== 'Property' ||
						property.key.type !== 'Identifier' ||
						property.value.type !== 'Identifier'
					)
						return;
					map[property.key.name] = property.value.name;
				});
			}
		});

	return map;
}

/**
 * Replaces import declarations that use default specifiers
 * Finds and replaces:
 * - `import React from 'react';`
 * - `var React = require('react');`
 *
 * Todo: This function does not handle `Object.React = require('react)` yet
 *
 * @param {string} name - old package name to replace import/require calls for
 * @param {string} newSpecifier - new specifier name
 * @param {string} newName - new package name
 * @param {import("jscodeshift").Collection} root - package name to replace import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {ReplaceDefaultImport}
 */
export function replaceDefaultImport(name, newSpecifier, newName, root, j) {
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

	const identifier =
		importDeclaration.paths().length > 0
			? importDeclaration.get().node.specifiers[0].local.name
			: requireDeclaration.paths().length > 0
				? requireDeclaration.find(j.Identifier).get().node.name
				: null;

	importDeclaration.forEach((path) => {
		j(path).replaceWith(
			j.importDeclaration(
				[j.importDefaultSpecifier(j.identifier(newSpecifier))],
				j.stringLiteral(newName),
			),
		);
	});

	requireDeclaration.forEach((path) => {
		const newExpression = j.assignmentExpression(
			'=',
			j.identifier(newSpecifier),
			j.callExpression(j.identifier('require'), [j.literal(newName)]),
		);
		j(path).replaceWith(newExpression);
	});

	return { identifier };
}

/**
 * @param {string} method - e.g. `array.prototype.flatMap`
 * @param {string} identifierName - e.g. `flatMap`
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {boolean} - true if the method was found and transformed, false otherwise
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

/**
 * @param {import("jscodeshift").ASTPath<import("jscodeshift").CallExpression>} path -  jscodeshift path
 * @param {string} instanceName - e.g. `Uint8Array`
 * @param {string} propertyName - e.g. `length`
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns
 */
export function transformInstanceProperty(path, instanceName, propertyName, j) {
	let dirtyFlag = false;
	const [instanceArg] = path.node.arguments;

	if (
		j.Identifier.check(instanceArg) ||
		isNewInstanceOf(instanceArg, instanceName, j)
	) {
		path.replace(
			// @ts-expect-error Unsure if it's possible in jsdoc to both assert the node type and
			// return a boolean
			j.memberExpression(instanceArg, j.identifier(propertyName)),
		);

		dirtyFlag = true;
	}

	return dirtyFlag;
}

/**
 * @param {import("jscodeshift").ASTPath<import("jscodeshift").CallExpression>} path -  jscodeshift path
 * @param {string} instanceName - e.g. `Uint8Array`
 * @param {string} methodName - e.g. `slice`
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns
 */
export function transformInstanceMethod(path, instanceName, methodName, j) {
	let dirtyFlag = false;
	const [instanceArg, ...otherArgs] = path.node.arguments;

	if (
		j.Identifier.check(instanceArg) ||
		isNewInstanceOf(instanceArg, instanceName, j)
	) {
		path.replace(
			j.callExpression(
				// @ts-expect-error Unsure if it's possible in jsdoc to both assert the node type and
				// return a boolean
				j.memberExpression(instanceArg, j.identifier(methodName)),
				otherArgs,
			),
		);

		dirtyFlag = true;
	}

	return dirtyFlag;
}

/**
 * @param {import("jscodeshift").Node} node - jscodeshift node
 * @param {string} name - e.g. `TypedArray`
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns
 */
function isNewInstanceOf(node, name, j) {
	return (
		j.NewExpression.check(node) &&
		node.callee.type === 'Identifier' &&
		node.callee.name === name
	);
}

/**
 * @param {string} method - e.g. `array.prototype.flatMap`
 * @param {string} identifierName - e.g. `flatMap`
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {boolean} - true if the method was found and transformed, false otherwise
 */
export function transformStringMethod(method, identifierName, root, j) {
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
			const [stringArg, ...otherArgs] = path.node.arguments;
			if (j.Identifier.check(stringArg) || j.Literal.check(stringArg)) {
				path.replace(
					j.callExpression(
						j.memberExpression(stringArg, j.identifier(identifierName)),
						otherArgs,
					),
				);
				dirtyFlag = true;
			}
		});

	return dirtyFlag;
}

/**
 * @param {string} importName - e.g. `math.acosh/polyfill`
 * @param {string} methodName - e.g. `acosh`
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {boolean} - true if the method was found and transformed, false otherwise
 */
export function transformMathPolyfill(importName, methodName, root, j) {
	const { identifier } = removeImport(importName, root, j);

	let dirtyFlag = false;
	root
		.find(j.CallExpression, {
			callee: {
				type: 'Identifier',
				name: identifier,
			},
		})
		.forEach((path) => {
			path.replace(
				j.callExpression(
					j.memberExpression(j.identifier('Math'), j.identifier(methodName)),
					path.node.arguments,
				),
			);
			dirtyFlag = true;
		});

	return dirtyFlag;
}
