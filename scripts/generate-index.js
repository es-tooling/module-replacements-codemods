import fs from 'fs';

/** @param {string} s */
const camelize = (s) => s.replace(/[-\.]./g, (x) => x[1].toUpperCase());

const folders = fs
	.readdirSync('./codemods')
	.filter((f) => fs.statSync(`./codemods/${f}`).isDirectory());

let obj = `
/**
 * @typedef {import('./types.js').Codemod} Codemod
 * @typedef {import('./types.js').CodemodOptions} CodemodOptions
 */

/**
 * @type {Record<string, (options: CodemodOptions) => Codemod>}
 */
export const codemods = {\n`;
let imports = ``;
const seenImports = new Set();

for (const folder of folders) {
	let importName = camelize(folder);
	if (seenImports.has(importName)) {
		importName += '2';
	}
	seenImports.add(importName);
	obj += `  "${folder}": ${importName},\n`;
	imports += `import ${importName} from './codemods/${folder}/index.js';\n`;
}
obj += `};`;

fs.writeFileSync('./index.js', imports + '\n' + obj);

console.log('Generated index.js');
