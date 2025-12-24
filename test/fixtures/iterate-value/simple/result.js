

// string, no callback
const collection0 = Array.from('foo');

// string, callback
for (const chr of ('foo')) {
  console.log(chr);
};

// string, callback ref
const callback0 = (chr) => console.log(chr);
for (const value of ('foo')) { callback0(value); };

// array, no callback
const collection1 = Array.from([3, 0, 3]);

// array, callback
for (const num of ([3, 0, 3])) {
  console.log(num);
};

// array, function callback
for (const num of ([3, 0, 3])) {
  console.log(num);
};

// array, no value in callback
for (const _value of ([8, 0, 8])) {
  console.log('bleep bloop');
};

// ignored because it has invalid usage
iterate([8, 0, 8], (num) => {}, 'unexpected-third-arg');
