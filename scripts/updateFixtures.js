import fs from 'node:fs';

const codemods = fs.readdirSync('./test/fixtures');

for (const codemod of codemods) {
	const fixtures = fs.readdirSync(`./test/fixtures/${codemod}`);

	for (const fixture of fixtures) {
		const after = `./test/fixtures/${codemod}/${fixture}/after.js`;
		const result = `./test/fixtures/${codemod}/${fixture}/result.js`;

		fs.copyFileSync(result, after);
	}
}
