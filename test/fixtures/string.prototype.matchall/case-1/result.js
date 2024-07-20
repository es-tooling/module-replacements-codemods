const assert = require("assert");

const str = "aabc";
const nonRegexStr = "ab";
const globalRegex = /[ac]/g;
const nonGlobalRegex = /[bc]/i;

assert.deepEqual(
  [...str.matchAll(nonRegexStr)],
  [...str.matchAll(new RegExp(nonRegexStr, "g"))],
);

assert.deepEqual(
  [...str.matchAll(globalRegex)],
  [
    Object.assign(["a"], { index: 0, input: str, groups: undefined }),
    Object.assign(["a"], { index: 1, input: str, groups: undefined }),
    Object.assign(["c"], { index: 3, input: str, groups: undefined }),
  ],
);

assert.throws(() => str.matchAll(nonGlobalRegex));
