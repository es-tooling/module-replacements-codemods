import { ts } from '@ast-grep/napi';

const qsLikeOptions = {
	nesting: true,
	nestingSyntax: 'js',
	arrayRepeat: true,
	arrayRepeatSyntax: 'bracket',
};
const qsLikeOptionsStr = JSON.stringify(qsLikeOptions);

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 * @typedef {import('@ast-grep/napi').SgNode} SgNode
 */

/**
 * @param {SgNode} obj
 */
function parseOptions(obj) {
	/** @type {Record<string, SgNode>} */
	const result = {};

	for (const child of obj.children()) {
		const key = child.field('key');
		const val = child.field('value');

		if (key && val) {
			result[key.text()] = val;
		}
	}

	return result;
}

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'qs',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const imports = root.findAll({
				rule: {
					pattern: {
						context: "import $NAME from 'qs'",
						strictness: 'relaxed',
					},
				},
			});
			const requires = root.findAll({
				rule: {
					pattern: {
						context: "require('qs')",
						strictness: 'relaxed',
					},
				},
			});
			let importName = 'qs';
			const edits = [];

			for (const imp of imports) {
				const source = imp.field('source');

				if (!source) {
					continue;
				}

				const quoteType = source.text().startsWith("'") ? "'" : '"';
				const nameMatch = imp.getMatch('NAME');

				if (nameMatch) {
					importName = nameMatch.text();
					edits.push(nameMatch.replace('pq'));
				}

				edits.push(source.replace(`${quoteType}picoquery${quoteType}`));
			}

			for (const req of requires) {
				const args = req.field('arguments');
				const firstArg = args?.child(1);
				const quoteType = firstArg?.text().startsWith('"') ? '"' : "'";

				edits.push(req.replace(`require(${quoteType}picoquery${quoteType})`));

				const parent = req.parent();

				if (parent && parent.kind() === 'variable_declarator') {
					const name = parent.field('name');
					if (name) {
						importName = name.text();
						edits.push(name.replace('pq'));
					}
				}
			}

			const expressions = root.findAll({
				rule: {
					pattern: `${importName}.$METHOD($$$ARGS)`,
				},
			});

			for (const expr of expressions) {
				const method = expr.getMatch('METHOD');
				const args = expr.getMultipleMatches('ARGS');
				const methodText = method?.text();
				const func = expr.field('function')?.field('object');

				if (
					!func ||
					!method ||
					(methodText !== 'parse' && methodText !== 'stringify')
				) {
					continue;
				}

				edits.push(func.replace('pq'));

				if (args.length === 1) {
					edits.push(args[0].replace(`${args[0].text()}, ${qsLikeOptionsStr}`));
				} else if (args.length > 2) {
					const opts = parseOptions(args[2]);

					/** @type {Record<string, unknown>} */
					const newOptions = { ...qsLikeOptions };

					if (opts.indices && opts.indices.kind() === 'false') {
						newOptions.nestingSyntax = 'dot';
						newOptions.arrayRepeatSyntax = 'repeat';
					}

					if (opts.arrayFormat && opts.arrayFormat.kind() === 'string') {
						const arrayFormat = opts.arrayFormat.child(1)?.text();
						if (arrayFormat === 'repeat') {
							newOptions.arrayRepeatSyntax = 'repeat';
						} else if (arrayFormat === 'indices') {
							newOptions.arrayRepeat = false;
						}
					}

					if (opts.allowDots && opts.allowDots.kind() === 'true') {
						newOptions.nestingSyntax = 'dot';
					}

					if (opts.parseArrays && opts.parseArrays.kind() === 'false') {
						newOptions.arrayRepeat = false;
					}

					if (opts.delimiter && opts.delimiter.kind() === 'string') {
						const delimiter = opts.delimiter.child(1)?.text();
						if (delimiter) {
							newOptions.delimiter = delimiter;
						}
					}

					edits.push(args[2].replace(JSON.stringify(newOptions)));
				}
			}

			return root.commitEdits(edits);
		},
	};
}
