const iterate = require('iterate-value');

// string, no callback
const collection0 = iterate('foo');

// string, callback
iterate('foo', (chr) => {
  console.log(chr);
});

// string, callback ref
const callback0 = (chr) => console.log(chr);
iterate('foo', callback0);

// array, no callback
const collection1 = iterate([3, 0, 3]);

// array, callback
iterate([3, 0, 3], (num) => {
  console.log(num);
});

// array, function callback
iterate([3, 0, 3], function (num) {
  console.log(num);
});

// array, no value in callback
iterate([8, 0, 8], () => {
  console.log('bleep bloop');
});

// ignored because it has invalid usage
iterate([8, 0, 8], (num) => {}, 'unexpected-third-arg');
