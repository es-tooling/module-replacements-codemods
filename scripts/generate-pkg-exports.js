#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.dirname(__dirname);

function findIndexFiles(dir, basePath = '') {
	const exports = {};
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const exportPath = basePath ? `${basePath}/${entry.name}` : entry.name;

		if (entry.isDirectory()) {
			const indexPath = path.join(fullPath, 'index.js');
			if (fs.existsSync(indexPath)) {
				const exportKey = `./codemods/${exportPath}/index.js`;
				exports[exportKey] = {
					types: `./types/codemods/${exportPath}/index.d.ts`,
					default: `./codemods/${exportPath}/index.js`,
				};
			}

			const nestedExports = findIndexFiles(fullPath, exportPath);
			Object.assign(exports, nestedExports);
		}
	}

	return exports;
}

async function generateExports() {
	const codemodsDir = path.join(rootDir, 'codemods');

	if (!fs.existsSync(codemodsDir)) {
		console.error('codemods directory not found');
		process.exit(1);
	}

	const exports = findIndexFiles(codemodsDir);

	exports['./index.js'] = {
		types: './types/index.d.ts',
		default: './index.js',
	};

	const sortedExports = Object.keys(exports)
		.sort()
		.reduce((acc, key) => {
			acc[key] = exports[key];
			return acc;
		}, {});

	console.log('Generated exports:');
	console.log(JSON.stringify({ exports: sortedExports }, null, 2));

	const packageJsonPath = path.join(rootDir, 'package.json');
	if (fs.existsSync(packageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		packageJson.exports = sortedExports;
		fs.writeFileSync(
			packageJsonPath,
			JSON.stringify(packageJson, null, 2) + '\n',
		);
		console.log('\n✓ Updated package.json with exports');
	} else {
		console.log('\nNo package.json found in root directory');
	}
}

generateExports();
