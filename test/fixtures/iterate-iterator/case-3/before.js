import iterateIterator from 'iterate-iterator';

// Test parenthesized parameter
iterateIterator([1, 2][Symbol.iterator](), (x) => console.log(x));
iterateIterator([1, 2][Symbol.iterator](), (y) => y * 2);
