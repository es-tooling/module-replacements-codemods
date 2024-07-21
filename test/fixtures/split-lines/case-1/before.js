// Test cases to ensure the codemod works correctly
import splitLines from 'split-lines';
import assert from 'assert';

// Basic case
assert.deepStrictEqual(splitLines('foo\nbar\nbaz\nrainbow'), ['foo', 'bar', 'baz', 'rainbow']);

// Preserve newlines case
assert.deepStrictEqual(splitLines('foo\r\nbar\r\nbaz\nrainbow', { preserveNewlines: true }), ['foo\r\n', 'bar\r\n', 'baz\n', 'rainbow']);

// Empty string
assert.deepStrictEqual(splitLines(''), ['']);

// Single line
assert.deepStrictEqual(splitLines('foo'), ['foo']);

// Only newline characters
assert.deepStrictEqual(splitLines('\n'), ['', '']);
assert.deepStrictEqual(splitLines('\r\n'), ['', '']);

// Newlines at the start and end
assert.deepStrictEqual(splitLines('\nfoo\n'), ['', 'foo', '']);
assert.deepStrictEqual(splitLines('\r\nfoo\r\n'), ['', 'foo', '']);

// Mixed newlines
assert.deepStrictEqual(splitLines('foo\r\nbar\r\nbaz\r\n', { preserveNewlines: true }), ['foo\r\n', 'bar\r\n', 'baz\r\n', '']);

// Newlines with additional properties
assert.deepStrictEqual(splitLines('foo\nbar\nbaz\nrainbow', { preserveNewlines: true, additionalProperty: true }), ['foo\n', 'bar\n', 'baz\n', 'rainbow']);