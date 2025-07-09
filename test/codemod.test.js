import { describe, it } from 'node:test';
import fs from 'node:fs';
import assert from 'assert';
import { codemods } from '../index.js';

describe('codemod', async () => {
	for (const [_, codemodFn] of Object.entries(codemods)) {
		const codemod = codemodFn();

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

					if (typeof result !== 'string') {
						result = result.code;
					}

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
				assert.strictEqual(
					result,
					after,
					`./fixtures/${codemod.name}/${fixture}/result.js`,
				);
			});
		}
	}
});
