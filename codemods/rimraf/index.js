import { ts } from '@ast-grep/napi';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 * @typedef {import('@ast-grep/napi').Edit} Edit
 */

const defaultOptions = `{recursive: true, force: true}`;
/**
 * @param {boolean} useRequire
 * @param {string} quoteType
 * @param {string[]} names
 * @param {string} source
 * @returns {string}
 */
const computeImport = (useRequire, quoteType, names, source) => {
	if (useRequire) {
		return `const {${names.join(', ')}} = require(${quoteType}${source}${quoteType});`;
	}
	return `import {${names.join(', ')}} from ${quoteType}${source}${quoteType};`;
};

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'rimraf',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const imports = root.findAll({
				rule: {
					any: [
						{
							pattern: {
								context: "import * as $NAME from 'rimraf'",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "import {$$$NAMES} from 'rimraf'",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "import $NAME from 'rimraf'",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "const {$$$NAMES} = require('rimraf')",
								strictness: 'relaxed',
							},
						},
						{
							pattern: {
								context: "const $NAME = require('rimraf')",
								strictness: 'relaxed',
							},
						},
					],
				},
			});

			if (imports.length === 0) {
				return file.source;
			}

			/** @type {Edit[]} */
			const edits = [];
			let quoteType = "'";
			/** @type {string[]} */
			const localNames = [];
			let isCommonJS = false;

			for (const imp of imports) {
				const importSource = imp.field('source');
				const requireCall = imp.find('require($SOURCE)');
				let source = null;

				if (importSource) {
					// ESM
					source = importSource.text();
				} else {
					// CJS
					source = requireCall?.getMatch('SOURCE')?.text();
				}

				if (!source) {
					continue;
				}

				if (!isCommonJS) {
					isCommonJS = requireCall !== null;
				}

				if (source?.startsWith('"')) {
					quoteType = '"';
				}

				const importedNames = imp.getMultipleMatches('NAMES');
				const importedName = imp.getMatch('NAME');

				// Its a default or namespace import
				if (importedName) {
					const importedNameText = importedName.text();
					localNames.push(
						importedNameText,
						`${importedNameText}.$_METHOD`,
						`${importedNameText}.$_METHOD.sync`,
					);
				}

				for (const importSpecifier of importedNames) {
					const importedName = importSpecifier.field('name');
					const value = importSpecifier.field('value');

					let localNameText;

					if (importedName) {
						// ESM
						const localName = importSpecifier.field('alias') ?? importedName;
						localNameText = localName.text();
					} else if (value) {
						// CJS
						localNameText = value.text();
					} else {
						localNameText = importSpecifier.text();
					}

					localNames.push(localNameText, `${localNameText}.sync`);
				}
			}

			const usagePatterns = [];
			for (const name of localNames) {
				usagePatterns.push(
					{
						pattern: `${name}($PATH, $OPTIONS)`,
					},
					{
						pattern: `${name}($PATH)`,
					},
				);
			}

			const usages = root.findAll({
				rule: {
					any: usagePatterns,
				},
			});

			let seenSync = false;
			let seenAsync = false;
			let seenGlob = false;

			for (const usage of usages) {
				const functionNode = usage.field('function');
				const functionText = functionNode?.text();
				const isSync =
					functionText !== undefined &&
					(functionText.includes('sync') || functionText?.includes('Sync'));

				if (!seenSync) {
					seenSync = isSync;
				}
				if (!seenAsync) {
					seenAsync = !isSync;
				}

				const fsName = isSync ? 'rmSync' : 'rm';
				const options = usage.getMatch('OPTIONS');
				const path = usage.getMatch('PATH');
				let optionsText = defaultOptions;

				// Shouldn't be possible
				if (path === null) {
					continue;
				}

				if (options) {
					if (options.kind() === 'object') {
						const globOption = options
							.children()
							.find(
								(child) =>
									child.field('key')?.text() === 'glob' &&
									child.field('value')?.text() !== 'false',
							);
						if (globOption) {
							const globValue = globOption.field('value')?.text();
							const globParams =
								globValue !== null && globValue !== 'true'
									? `${path.text()}, ${globValue}`
									: path.text();
							seenGlob = true;
							// Indentation will be a mess, but do we care? use a formatter
							edits.push(
								usage.replace(
									`
Promise.all(
  (await glob(${globParams})).map((filePath) =>
    ${fsName}(filePath, ${defaultOptions}))
)
                `.trim(),
								),
							);
							continue;
						}

						const optionsObjectText = options.text();
						const bracketIndex = optionsObjectText.indexOf('{');
						const beforeBracket = optionsObjectText.slice(0, bracketIndex);
						const afterBracket = optionsObjectText.slice(bracketIndex + 1);
						const afterBracketNextLine =
							afterBracket.startsWith('\r') || afterBracket.startsWith('\n');
						const afterBracketSpace = afterBracketNextLine ? '' : ' ';
						optionsText = `${beforeBracket}{recursive: true, force: true,${afterBracketSpace}${afterBracket}`;
					} else {
						optionsText = options.text();
					}
				}

				edits.push(usage.replace(`${fsName}(${path.text()}, ${optionsText})`));
			}

			if (imports.length > 0) {
				const [firstImport, ...remainingImports] = imports;

				let replacedImports = [];

				if (seenAsync) {
					replacedImports.push(
						computeImport(isCommonJS, quoteType, ['rm'], 'node:fs/promises'),
					);
				}

				if (seenSync) {
					replacedImports.push(
						computeImport(isCommonJS, quoteType, ['rmSync'], 'node:fs'),
					);
				}

				if (seenGlob) {
					replacedImports.push(
						computeImport(isCommonJS, quoteType, ['glob'], 'tinyglobby'),
					);
				}

				edits.push(firstImport.replace(replacedImports.join('\n')));

				for (const imp of remainingImports) {
					edits.push(imp.replace(''));
				}
			}

			return root.commitEdits(edits);
		},
	};
}
