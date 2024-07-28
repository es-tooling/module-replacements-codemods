import assert from 'assert';

const regex = /[a-z]/gi;

// Argument is a regex
const clone1 = new RegExp(/[a-z]/gi);
assert.deepStrictEqual(regex, clone1);
assert.ok(regex !== clone1)

// Argument is an identifier
const clone2 = new RegExp(regex);
assert.deepStrictEqual(regex, clone2);
assert.ok(regex !== clone2);