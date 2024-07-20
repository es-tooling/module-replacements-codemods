const assert = require("assert");
const matchAll = require("string.prototype.matchall");

const str = "aabc";
const nonRegexStr = "ab";
const globalRegex = /[ac]/g;
const nonGlobalRegex = /[bc]/i;

assert.deepEqual(
  [...matchAll(str, nonRegexStr)],
  [...matchAll(str, new RegExp(nonRegexStr, "g"))],
);

assert.deepEqual(
  [...matchAll(str, globalRegex)],
  [
    Object.assign(["a"], { index: 0, input: str, groups: undefined }),
    Object.assign(["a"], { index: 1, input: str, groups: undefined }),
    Object.assign(["c"], { index: 3, input: str, groups: undefined }),
  ],
);

assert.throws(() => matchAll(str, nonGlobalRegex));
