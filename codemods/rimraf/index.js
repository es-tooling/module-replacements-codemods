import { ts } from '@ast-grep/napi';
import {
	findDefaultImports,
	findNamedImports,
	generateImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'rimraf';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 * @typedef {import('@ast-grep/napi').Edit} Edit
 */

const defaultOptions = `{recursive: true, force: true}`;

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: MODULE_NAME,
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const { imports: namedImports, localNames: namedLocals } =
				findNamedImports(root, MODULE_NAME);
			const { imports: defaultImports, localNames: defaultLocals } =
				findDefaultImports(root, MODULE_NAME);

			const namespaceImports = root.findAll({
				rule: {
					pattern: {
						context: `import * as $NAME from '${MODULE_NAME}'`,
						strictness: 'relaxed',
					},
				},
			});

			const imports = [...namedImports, ...defaultImports, ...namespaceImports];

			if (imports.length === 0) {
				return file.source;
			}

			/** @type {Edit[]} */
			const edits = [];
			const quoteType = imports.some((imp) => imp.text().includes('"'))
				? '"'
				: "'";
			const isCommonJS = imports.some(
				(imp) => imp.find('require($SOURCE)') !== null,
			);

			/** @type {string[]} */
			const localNames = [];

			for (const name of namedLocals) {
				localNames.push(name, `${name}.sync`);
			}
			for (const name of defaultLocals) {
				localNames.push(name, `${name}.$_METHOD`, `${name}.$_METHOD.sync`);
			}
			for (const imp of namespaceImports) {
				const name = imp.getMatch('NAME')?.text();
				if (name) {
					localNames.push(name, `${name}.$_METHOD`, `${name}.$_METHOD.sync`);
				}
			}

			const usagePatterns = [];
			for (const name of localNames) {
				usagePatterns.push(
					{ pattern: `${name}($PATH, $OPTIONS)` },
					{ pattern: `${name}($PATH)` },
				);
			}

			const usages = root.findAll({
				rule: { any: usagePatterns },
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

				const replacedImports = [];

				if (seenAsync) {
					replacedImports.push(
						generateImport(isCommonJS, quoteType, 'rm', 'node:fs/promises'),
					);
				}

				if (seenSync) {
					replacedImports.push(
						generateImport(isCommonJS, quoteType, 'rmSync', 'node:fs'),
					);
				}

				if (seenGlob) {
					replacedImports.push(
						generateImport(isCommonJS, quoteType, 'glob', 'tinyglobby'),
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
