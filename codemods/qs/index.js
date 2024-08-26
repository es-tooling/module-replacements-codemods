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
 * @return {Record<string, SgNode>}
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

/** @typedef {Record<string, unknown> | ((value: SgNode) => Record<string, unknown>|null) | null} ReplacementOptions */
/** @typedef {({kind: string; options: ReplacementOptions})} Replacement */
/** @typedef {({replacements: Replacement[]})} Replacer */
/** @type {Record<string, Replacer>} */
const replacements = {
	indices: {
		replacements: [
			{
				kind: 'false',
				options: {
					nestingSyntax: 'dot',
					arrayRepeatSyntax: 'repeat',
				},
			},
			{
				kind: 'true',
				options: {
					nestingSyntax: 'js',
				},
			},
		],
	},
	arrayFormat: {
		replacements: [
			{
				kind: 'string',
				options: (value) => {
					const formatStr = value.child(1)?.text();
					if (formatStr === 'repeat') {
						return { arrayRepeatSyntax: 'repeat' };
					} else if (formatStr === 'indices') {
						return { arrayRepeat: false };
					}
					return { arrayRepeatSyntax: 'bracket' };
				},
			},
		],
	},
	allowDots: {
		replacements: [
			{
				kind: 'true',
				options: {
					nestingSyntax: 'js',
				},
			},
			{
				kind: 'false',
				options: {
					nestingSyntax: 'index',
				},
			},
		],
	},
	parseArrays: {
		replacements: [
			{
				kind: 'false',
				options: {
					arrayRepeat: false,
				},
			},
			{
				kind: 'true',
				options: {
					arrayRepeat: true,
				},
			},
		],
	},
	delimiter: {
		replacements: [
			{
				kind: 'string',
				options: (value) => {
					const delimiter = value.child(1)?.text();
					if (delimiter) {
						return { delimiter };
					}
					console.warn(
						`Warning: encountered a delimiter we could not ` +
							`transform. It will be dropped, so may need additional fixes ` +
							`after this codemod executes`,
					);
					return null;
				},
			},
		],
	},
};

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

				let decodeResult = false;

				if (args.length === 1) {
					edits.push(args[0].replace(`${args[0].text()}, ${qsLikeOptionsStr}`));
				} else if (args.length > 2) {
					const opts = parseOptions(args[2]);

					/** @type {Record<string, unknown>} */
					const newOptions = { ...qsLikeOptions };

					for (const [key, val] of Object.entries(opts)) {
						// Special case for the `encode` option if it is `false`, as we
						// need to wrap the entire result with `decodeURIComponent`
						if (key === 'encode' && val.kind() === 'false') {
							decodeResult = true;
							continue;
						}

						const replacer = replacements[key];

						if (!replacer) {
							console.warn(
								`Warning: encountered an unknown option. ` +
									`The option ("${key}") will be dropped, so may need ` +
									`additional fixes after this codemod executes.`,
							);
							continue;
						}

						let foundReplacement = false;
						for (const replacement of replacer.replacements) {
							if (replacement.kind === val.kind()) {
								const replacementOpts =
									typeof replacement.options === 'function'
										? replacement.options(val)
										: replacement.options;
								foundReplacement = true;
								if (replacementOpts) {
									for (const optKey in replacementOpts) {
										newOptions[optKey] = replacementOpts[optKey];
									}
								}
							}
						}

						if (!foundReplacement) {
							console.warn(
								`Warning: encountered an option with a value we could not parse. ` +
									`The option ("${key}") has a computed value or an unexpected ` +
									`type. It will be dropped, so may need additional fixes ` +
									`after this codemod executes.`,
							);
						}
					}

					edits.push(args[2].replace(JSON.stringify(newOptions)));
				}

				if (decodeResult) {
					console.warn(
						`Warning: the "encode: false" option will be ` +
							`replaced by a call to decodeURIComponent`,
					);
					edits.push(func.replace('decodeURIComponent(pq'));

					const argsChildren = expr.field('arguments')?.children();

					if (argsChildren) {
						const lastArgsChild = argsChildren[argsChildren.length - 1];

						if (lastArgsChild.kind() === ')') {
							edits.push(lastArgsChild.replace(`${lastArgsChild.text()})`));
						}
					}
				} else {
					edits.push(func.replace('pq'));
				}
			}

			return root.commitEdits(edits);
		},
	};
}
