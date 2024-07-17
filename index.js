#!/usr/bin/env node

import fg from 'fast-glob';
import picocolors from 'picocolors';
import { readFile } from 'fs/promises';
import { codemods } from './codemods/index.js';

const entries = await fg(['**/*.js', '!**/node_modules/**'], { cwd: process.cwd() });

/**
 * @TODO
 * Make cli output a bit nicer
 * Log some statistics; how many files had changes, how many codemods were run, how many codemods removed packages
 * Remove the packages from the package.json
 * I'm not sure it makes sense to have the glob on the codemod level itself
 */
await Promise.all(entries.map(async (entry) => {
  for (const [name, codemodFn] of Object.entries(codemods)) {
    const codemod = codemodFn();

    try {
      const source = await readFile(entry, 'utf-8');
      const result = await codemod.transform({ 
        file: {
          source,
          filename: entry
        },
      });

      if (source !== result) {
        console.log(picocolors.green(`\n- Codemod "${name}" made changes to "${entry}".`));
      } else {
        console.log(picocolors.gray(`\n- Codemod "${name}" finished successfully for "${entry}"; no changes made.`));
      }

    } catch(e) {
      // @ts-expect-error
      console.log(picocolors.red(`\n- Codemod "${name}" failed for "${entry}" with error: \n\n  ${e.stack}`));
    }
  }
}));