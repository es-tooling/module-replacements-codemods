var assert = require("assert");

assert.equal(("foo").toString().padStart(5), "foo  ");

assert.equal(("foobar").toString().padStart(6), "foobar");

assert.equal((1).toString().padStart(2, "0"), "01");

assert.equal((17).toString().padStart(5, 0), "00017");
