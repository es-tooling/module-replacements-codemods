const assert = require("assert");

const str = "aabc";

assert.equal(str.replaceAll(/a/g, "z"), str.replace(/a/g, "z"));

assert.equal(str.replaceAll("a", "z"), "zzbc");
