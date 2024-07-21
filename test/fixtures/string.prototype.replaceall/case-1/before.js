const assert = require("assert");
const replaceAll = require("string.prototype.replaceall");

const str = "aabc";

assert.equal(replaceAll(str, /a/g, "z"), str.replace(/a/g, "z"));

assert.equal(replaceAll(str, "a", "z"), "zzbc");
