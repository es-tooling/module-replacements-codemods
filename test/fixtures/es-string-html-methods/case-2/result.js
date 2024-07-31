var assert = require('assert');

assert.equal('a'.anchor('b'), '<a name="b">a</a>');
assert.equal('a'.big(), '<big>a</big>');
assert.equal('a'.blink(), '<blink>a</blink>');
assert.equal('a'.bold(), '<b>a</b>');
assert.equal('a'.fixed(), '<tt>a</tt>');
assert.equal('a'.fontcolor('b'), '<font color="b">a</font>');
assert.equal('a'.fontsize('b'), '<font size="b">a</font>');
assert.equal('a'.italics(), '<i>a</i>');
assert.equal('a'.link('b'), '<a href="b">a</a>');
assert.equal('a'.small(), '<small>a</small>');
assert.equal('a'.strike(), '<strike>a</strike>');
assert.equal('a'.sub(), '<sub>a</sub>');
assert.equal('a'.sup(), '<sup>a</sup>');