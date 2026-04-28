
import assert from "assert";

const array = [97, 98, 99];

const letters = array.map((c) => {
  return String.fromCharCode(c);
});

assert.deepEqual(letters, ["a", "b", "c"]);
