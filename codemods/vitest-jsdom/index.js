import { ts } from '@ast-grep/napi';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 * @typedef {import('@ast-grep/napi').Edit} Edit
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'vitest-jsdom',
		to: '@vitest/browser-playwright',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			/** @type {Edit[]} */
			const edits = [];

			// Find environment: 'jsdom' or environment: 'happy-dom'
			const envProps = root.findAll({
				rule: {
					pattern: {
						context: '{ environment: "$ENV" }',
						strictness: 'relaxed',
						selector: 'pair',
					},
				},
			});

			for (const envProp of envProps) {
				const envValue = envProp.getMatch('ENV');
				if (!envValue) continue;

				const envText = envValue.text();
				// Only transform if it's jsdom or happy-dom (unquoted)
				if (envText === 'jsdom' || envText === 'happy-dom') {
					// Replace the entire environment property with browser config
					const browserConfig = `browser: {
      provider: playwright(),
      enabled: true,
      instances: [
        { browser: 'chromium' },
      ],
    }`;

					edits.push(envProp.replace(browserConfig));
				}
			}

			// Check if playwright import already exists
			const playwrightImports = root.findAll({
				rule: {
					pattern: {
						context: "import { playwright } from '@vitest/browser-playwright'",
						strictness: 'relaxed',
					},
				},
			});

			// If no edits were made (no environment to replace), return original
			if (edits.length === 0) {
				return file.source;
			}

			// Add playwright import if it doesn't exist
			if (playwrightImports.length === 0) {
				// Find the last import statement
				const imports = root.findAll({
					rule: {
						kind: 'import_statement',
					},
				});

				if (imports.length > 0) {
					const lastImport = imports[imports.length - 1];
					const importEnd = lastImport.range().end;

					// Insert the playwright import after the last import
					edits.push({
						startPos: importEnd.index,
						endPos: importEnd.index,
						insertedText:
							"\nimport { playwright } from '@vitest/browser-playwright'",
					});
				}
			}

			return root.commitEdits(edits);
		},
	};
}
