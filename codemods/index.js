import { readdir } from 'node:fs/promises';

/**
 * @typedef {import('../types.js').Codemod} Codemod
 * @typedef {import('../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @returns {Promise<Record<string, (opts?: CodemodOptions) => Codemod>>}
 */
export const getCodemods = async () => {
	const codemods = await readdir('./codemods', {
		withFileTypes: true,
	});
	return Object.fromEntries(
		await Promise.all(
			codemods
				.filter((codemod) => codemod.isDirectory())
				.map(async (codemod) => {
					const codemodObj = await import(`./${codemod.name}/index.js`);
					return [codemod.name, codemodObj.default];
				}),
		),
	);
};
