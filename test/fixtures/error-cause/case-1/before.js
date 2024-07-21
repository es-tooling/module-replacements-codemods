const assert = require("assert");

require("error-cause/auto");

try {
  x();
} catch (e) {
  const actual = new Error("a better message!", { cause: e });
  assert(actual instanceof Error);
  assert(actual.cause === e);
}
