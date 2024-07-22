import fs from 'fs';
import jscodeshift from 'jscodeshift';

/**
 * Usage:
 * node scripts/scaffold-codemod.js <name>
 *
 * e.g.:
 * node scripts/scaffold-codemod.js is-whitespace
 */

const name = process.argv[2];

/** @param {string} s */
const camelize = (s) => s.replace(/[-\.]./g, (x) => x[1].toUpperCase());

fs.mkdirSync(`./test/fixtures/${name}/case-1`, { recursive: true });
fs.writeFileSync(
	`./test/fixtures/${name}/case-1/before.js`,
	'// Add the code you want to transform here',
);
fs.writeFileSync(
	`./test/fixtures/${name}/case-1/result.js`,
	'// This file will contain the actual result of the codemod transformation after running the tests, this is expected to be equal to the `after.js` file. This file exists for easy debugging purposes.',
);
fs.writeFileSync(
	`./test/fixtures/${name}/case-1/after.js`,
	'// Add the expected output here',
);

fs.mkdirSync(`./codemods/${name}`);
fs.writeFileSync(
	`./codemods/${name}/index.js`,
	`
/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function(options) {
  return {
    name: '${name}',
    transform: ({ file }) => {
      return '';
    },
  }
};
`,
);
