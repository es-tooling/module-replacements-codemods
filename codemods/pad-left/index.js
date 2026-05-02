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
    name: 'pad-left',
    to: 'native',
    transform: ({ file }) => {
      const src = file.source;
      const ast = ts.parse(src);
      const root = ast.root();

      const imports = root.findAll({
        rule: {
          any: [
            { pattern: { context: "import $NAME from 'pad-left'", strictness: 'relaxed' } },
            { pattern: { context: 'import $NAME from "pad-left"', strictness: 'relaxed' } },

            { pattern: { context: "const $NAME = require('pad-left')", strictness: 'relaxed' } },
            { pattern: { context: 'const $NAME = require("pad-left")', strictness: 'relaxed' } },

            { pattern: { context: "let $NAME = require('pad-left')", strictness: 'relaxed' } },
            { pattern: { context: 'let $NAME = require("pad-left")', strictness: 'relaxed' } },

            { pattern: { context: "var $NAME = require('pad-left')", strictness: 'relaxed' } },
            { pattern: { context: 'var $NAME = require("pad-left")', strictness: 'relaxed' } },
          ],
        },
      });

      /** @type {Edit[]} */
      const edits = [];
      /** @type {string[]} */
      const localNames = [];

      for (const imp of imports) {
        const name = imp.getMatch('NAME')?.text();
        if (name && !localNames.includes(name)) {
          localNames.push(name);
        }

        const rng = imp.range();
        let start = rng.start.index;
        let end = rng.end.index;

        const next2 = src.slice(end, end + 2);
        if (next2 === '\r\n') {
          end += 2;
        } else {
          const next1 = src[end];
          if (next1 === '\n' || next1 === '\r') end += 1;
        }

        edits.push({ startPos: start, endPos: end, insertedText: '' });
      }

      if (localNames.length === 0) {
        return edits.length ? root.commitEdits(edits) : file.source;
      }

      const usagePatterns = [];
      for (const name of localNames) {
        usagePatterns.push(
          { pattern: `${name}($VALUE, $WIDTH, $FILL)` },
          { pattern: `${name}($VALUE, $WIDTH)` },
          { pattern: `${name}($VALUE)` },
        );
      }

      const calls = root.findAll({ rule: { any: usagePatterns } });

      for (const call of calls) {
        const value = call.getMatch('VALUE');
        if (!value) continue;

        const width = call.getMatch('WIDTH');
        const fill = call.getMatch('FILL');

        const args = [];
        if (width) args.push(width.text());
        if (fill) args.push(fill.text());

        const newText = `(${value.text()}).toString().padStart(${args.join(', ')})`;
        edits.push(call.replace(newText));
      }

      return edits.length ? root.commitEdits(edits) : file.source;
    },
  };
}