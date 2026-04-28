import map from "array-map";
import assert from "assert";

const array = [97, 98, 99];

const letters = map(array, (c) => {
  return String.fromCharCode(c);
});

assert.deepEqual(letters, ["a", "b", "c"]);
