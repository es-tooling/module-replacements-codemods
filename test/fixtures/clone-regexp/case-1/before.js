import cloneRegexp from 'clone-regexp';
import assert from 'assert';

const regex = /[a-z]/gi;

// Argument is a regex
const clone1 = cloneRegexp(/[a-z]/gi);
assert.deepStrictEqual(regex, clone1);
assert.ok(regex !== clone1)

// Argument is an identifier
const clone2 = cloneRegexp(regex);
assert.deepStrictEqual(regex, clone2);
assert.ok(regex !== clone2);