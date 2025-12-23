import { describe, it } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert';
import { codemods } from '../index.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function discoverAlternatives() {
	const packageJson = JSON.parse(
		fs.readFileSync(join(__dirname, '../package.json'), 'utf8'),
	);

	/** @type {Array<{path: string, codemodFn: () => import('../types.js').Codemod}>} */
	const alternatives = [];

	for (const [exportPath, exportConfig] of Object.entries(
		packageJson.exports,
	)) {
		const match = exportPath.match(
			/^\.\/codemods\/([^/]+)\/([^/]+)\/index\.js$/,
		);
		if (match) {
			const [, pkg, alt] = match;
			const codemodModule = await import(`../${exportPath}`);
			const codemodFn = codemodModule.default;
			alternatives.push({ path: exportPath, codemodFn });
		}
	}

	return alternatives;
}

/**
 * @param {import('../types.js').Codemod} codemod
 */
async function testCodemod(codemod) {
	const fixtures = fs.readdirSync(`./test/fixtures/${codemod.name}`);

	if (!fixtures.length) {
		throw new Error(
			`No fixtures found for codemod "${codemod.name}", make sure to add some.`,
		);
	}

	for (const fixture of fixtures) {
		it(`${codemod.name} - ${fixture}`, async () => {
			const filename = `./test/fixtures/${codemod.name}/${fixture}/before.js`;
			const before = fs.readFileSync(
				`./test/fixtures/${codemod.name}/${fixture}/before.js`,
				'utf8',
			);
			const after = fs.readFileSync(
				`./test/fixtures/${codemod.name}/${fixture}/after.js`,
				'utf8',
			);
			let result;
			try {
				result = await codemod.transform({
					file: {
						filename,
						source: before,
					},
				});
				fs.writeFileSync(
					`./test/fixtures/${codemod.name}/${fixture}/result.js`,
					result,
				);
			} catch (e) {
				throw new Error(
					`Codemod "${codemod.name}" failed on fixture "${fixture}"`,
					{ cause: e },
				);
			}
			assert.strictEqual(result, after);
		});
	}
}

describe('codemod', async () => {
	for (const [_, codemodFn] of Object.entries(codemods)) {
		const codemod = codemodFn();
		await testCodemod(codemod);
	}

	const alternatives = await discoverAlternatives();

	for (const { codemodFn } of alternatives) {
		const codemod = codemodFn();
		await testCodemod(codemod);
	}
});
