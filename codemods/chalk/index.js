import { ts } from '@ast-grep/napi';

const picoNames = [
	'isColorSupported',
	'reset',
	'bold',
	'dim',
	'italic',
	'underline',
	'inverse',
	'hidden',
	'strikethrough',
	'black',
	'red',
	'green',
	'yellow',
	'blue',
	'magenta',
	'cyan',
	'white',
	'gray',
	'bgBlack',
	'bgRed',
	'bgGreen',
	'bgYellow',
	'bgBlue',
	'bgMagenta',
	'bgCyan',
	'bgWhite',
];

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
		name: 'chalk',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const imports = root.findAll({
				rule: {
					pattern: {
						context: "import $NAME from 'chalk'",
						strictness: 'relaxed',
					},
				},
			});
			const requires = root.findAll({
				rule: {
					pattern: {
						context: "require('chalk')",
						strictness: 'relaxed',
					},
				},
			});
			let chalkName = 'chalk';
			const edits = [];

			for (const imp of imports) {
				const source = imp.field('source');

				if (!source) {
					continue;
				}

				const quoteType = source.text().startsWith("'") ? "'" : '"';
				const nameMatch = imp.getMatch('NAME');

				if (nameMatch) {
					const namespaceImport = nameMatch.find({
						rule: {
							kind: 'identifier',
							inside: {
								kind: 'namespace_import',
							},
						},
					});

					if (namespaceImport) {
						chalkName = namespaceImport.text();
					} else {
						chalkName = nameMatch.text();
					}
					edits.push(nameMatch.replace('* as pc'));
				}

				edits.push(source.replace(`${quoteType}picocolors${quoteType}`));
			}

			for (const req of requires) {
				const args = req.field('arguments');
				const firstArg = args?.child(1);
				const quoteType = firstArg?.text().startsWith('"') ? '"' : "'";

				edits.push(req.replace(`require(${quoteType}picocolors${quoteType})`));

				const parent = req.parent();

				if (parent && parent.kind() === 'variable_declarator') {
					const name = parent.field('name');
					if (name) {
						chalkName = name.text();
						edits.push(name.replace('pc'));
					}
				}
			}

			const chalkMethods = root.findAll({
				utils: {
					has_ident: {
						any: [
							{
								has: {
									kind: 'identifier',
									regex: chalkName,
								},
							},
							{
								has: {
									kind: 'member_expression',
									matches: 'has_ident',
								},
							},
						],
					},
				},
				rule: {
					kind: 'call_expression',
					has: {
						kind: 'member_expression',
						matches: 'has_ident',
					},
				},
			});

			for (const method of chalkMethods) {
				const fn = method.field('function');
				const args = method.field('arguments');

				if (!fn || !args) {
					continue;
				}

				const fnParts = fn.text().split('.');
				const extraNesting = ')'.repeat(fnParts.length - 2);

				let newFn = '';

				for (let i = 1; i < fnParts.length; i++) {
					const part = fnParts[i];

					if (!picoNames.includes(part)) {
						throw new Error(
							`Could not auto-fix code as picocolors does not support the ${part} export in source:\n\n${method.text()}`,
						);
					}

					const last = i === fnParts.length - 1;
					newFn += `pc.${part}${last ? '' : '('}`;
				}

				edits.push(fn.replace(newFn));

				const argsChildren = args.children();
				const argsFirstChild = argsChildren[0];
				const argsLastChild = argsChildren[argsChildren.length - 1];

				if (argsFirstChild.kind() !== '(') {
					edits.push(argsFirstChild.replace(`(${argsFirstChild.text()}`));
					edits.push(
						argsLastChild.replace(`${argsLastChild.text()})${extraNesting}`),
					);
				} else {
					edits.push(
						argsLastChild.replace(`${argsLastChild.text()}${extraNesting}`),
					);
				}
			}

			return root.commitEdits(edits);
		},
	};
}
