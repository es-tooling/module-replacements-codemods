
var assert = require("assert");

assert.equal(/^#!(.+)/.test("#!/usr/bin/env node\nconsole.log('foo');"), true);
assert.equal(/^#!(.+)/.exec("#!/usr/bin/env node")[1], "/usr/bin/env node");
assert.equal(/^#!(.+)/.test("console.log('foo');"), false);
