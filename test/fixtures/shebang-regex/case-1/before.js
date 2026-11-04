var shebangRegex = require("shebang-regex");
var assert = require("assert");

assert.equal(shebangRegex.test("#!/usr/bin/env node\nconsole.log('foo');"), true);
assert.equal(shebangRegex.exec("#!/usr/bin/env node")[1], "/usr/bin/env node");
assert.equal(shebangRegex.test("console.log('foo');"), false);
