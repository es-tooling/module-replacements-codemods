import assert from 'assert';

// Basic case
assert.deepStrictEqual('foo\nbar\nbaz\nrainbow'.split(/\r?\n/), ['foo', 'bar', 'baz', 'rainbow']);

// Preserve newlines case
assert.deepStrictEqual('foo\r\nbar\r\nbaz\nrainbow'.split(/(\r?\n)/).reduce((acc, part, index, array) => {
  if (index % 2 === 0) {
    acc.push(part + (array[index + 1] || ""));
  }

  return acc;
}, []), ['foo\r\n', 'bar\r\n', 'baz\n', 'rainbow']);

// Empty string
assert.deepStrictEqual(''.split(/\r?\n/), ['']);

// Single line
assert.deepStrictEqual('foo'.split(/\r?\n/), ['foo']);

// Only newline characters
assert.deepStrictEqual('\n'.split(/\r?\n/), ['', '']);
assert.deepStrictEqual('\r\n'.split(/\r?\n/), ['', '']);

// Newlines at the start and end
assert.deepStrictEqual('\nfoo\n'.split(/\r?\n/), ['', 'foo', '']);
assert.deepStrictEqual('\r\nfoo\r\n'.split(/\r?\n/), ['', 'foo', '']);

// Mixed newlines
assert.deepStrictEqual('foo\r\nbar\r\nbaz\r\n'.split(/(\r?\n)/).reduce((acc, part, index, array) => {
  if (index % 2 === 0) {
    acc.push(part + (array[index + 1] || ""));
  }

  return acc;
}, []), ['foo\r\n', 'bar\r\n', 'baz\r\n', '']);

// Newlines with additional properties
assert.deepStrictEqual('foo\nbar\nbaz\nrainbow'.split(/(\r?\n)/).reduce((acc, part, index, array) => {
  if (index % 2 === 0) {
    acc.push(part + (array[index + 1] || ""));
  }

  return acc;
}, []), ['foo\n', 'bar\n', 'baz\n', 'rainbow']);