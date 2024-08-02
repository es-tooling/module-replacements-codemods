/**
 * @typedef {Object} Module
 * @property {String} moduleName
 * @property {String} importName
 * @property {boolean?} cjsNamespace
 */

/**
 * Replaces an import statement from one module to another. Handles esm different
 * variations of esm and cjs imports, as well as code references to the imports.
 *
 * @param {import('jscodeshift')} j
 * @param {import('jscodeshift').Collection<any>} root
 * @param {Module} importModule
 * @param {Module} replacementModule
 */
export function replaceImport(j, root, importModule, replacementModule) {
	const createError = (/** @type {string} */ msg) =>
		new Error(`Could not replace ${importModule.moduleName}: ${msg}`);
	/** @type {string | undefined} */
	let bindingName;
	const importDeclarations = root.find(j.ImportDeclaration, {
		source: { value: importModule.moduleName },
	});

	const requireDeclarations = root.find(j.VariableDeclarator, {
		init: {
			callee: { name: 'require' },
			arguments: [{ value: importModule.moduleName }],
		},
	});

	if (importDeclarations.size() + requireDeclarations.size() > 1) {
		throw createError('Multiple import statements are not yet supported');
	}

	importDeclarations.forEach((path) => {
		if (path.value.source.value === importModule.moduleName) {
			const specifiers = path.value.specifiers ?? [];
			if (specifiers.length > 1) {
				throw new Error(
					`Error while replacing \`${importModule.moduleName}\`, multiple specifiers not supported`,
				);
			}

			const specifier = specifiers[0];
			if (specifier.type === 'ImportSpecifier') {
				if (
					importModule.importName !== 'default' &&
					importModule.importName === specifier.imported.name
				) {
					bindingName = specifier.local?.name ?? specifier.imported.name;
				}
			} else if (
				specifier.type === 'ImportDefaultSpecifier' &&
				importModule.importName === 'default'
			) {
				bindingName = specifier.local?.name;
			} else if (specifier.type === 'ImportNamespaceSpecifier') {
				const localName = specifier.local?.name;
				if (!localName) {
					throw createError('Namespace specifier does not have a local name.');
				}
				// look up references to the namespace
				root.findVariableDeclarators().forEach((declarator) => {
					const { id, init } = declarator.node;
					if (id.type === 'Identifier' && init?.type === 'MemberExpression') {
						// case: const foo = bar.foo;
						const { object, property } = init;
						if (
							object.type === 'Identifier' &&
							object.name === localName &&
							property.type === 'Identifier' &&
							property.name === importModule.importName
						) {
							bindingName = id.name;
						}
					} else if (
						id.type === 'ObjectPattern' &&
						init?.type === 'Identifier'
					) {
						// case: const { foo } = bar; or const { foo: x } = bar;
						if (init.name === localName) {
							const prop = id.properties.find(
								(prop) =>
									prop.type === 'Property' &&
									prop.key.type === 'Identifier' &&
									prop.key.name === importModule.importName,
							);
							if (
								prop?.type === 'Property' &&
								prop.value.type === 'Identifier'
							) {
								bindingName = prop.value.name;
							}
						}
					}

					// remove the namespace lookup, since we are rewriting it into a named or default import
					if (bindingName) {
						declarator.prune();
					}
				});
			}

			if (bindingName) {
				path.value.source = j.literal(replacementModule.moduleName);
				const specifierType =
					replacementModule.importName === 'default'
						? j.importDefaultSpecifier
						: j.importSpecifier;
				path.value.specifiers = [
					specifierType(j.identifier(replacementModule.moduleName)),
				];
			}
		}
	});

	requireDeclarations.forEach((path) => {
		if (path.value.id.type === 'Identifier') {
			bindingName = path.value.id.name;
			path.value.id = j.objectPattern.from({
				properties: [
					j.property.from({
						key: j.identifier(replacementModule.moduleName),
						value: j.identifier(replacementModule.importName),
						shorthand: true,
						kind: 'init',
					}),
				],
			});
		}

		if (path.value.init?.type === 'CallExpression') {
			path.value.init.arguments[0] = j.literal(replacementModule.moduleName);
		}
	});

	if (bindingName) {
		const identifiers = root.find(j.Identifier, { name: bindingName });
		identifiers.forEach((identifier) => {
			identifier.replace(j.identifier(replacementModule.importName));
		});
	}

	return !!bindingName;
}
