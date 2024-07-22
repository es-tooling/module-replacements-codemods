var stringRaw = require("string.raw");
var assert = require("assert");

const filePath = stringRaw`C:\Development\profile\new\aboutme.html`;
assert.equal(filePath, "C:\\Development\\profile\\new\\aboutme.html");
