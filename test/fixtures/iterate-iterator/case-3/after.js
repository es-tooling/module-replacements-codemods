

// Test parenthesized parameter
for (const x of {
  [Symbol.iterator]: () => [1, 2][Symbol.iterator]()
}) {
  console.log(x);
};
for (const y of {
  [Symbol.iterator]: () => [1, 2][Symbol.iterator]()
}) {
  y * 2;
};
