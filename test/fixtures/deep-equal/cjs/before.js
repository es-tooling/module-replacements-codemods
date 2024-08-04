const deepEqual = require('deep-equal');

deepEqual("a", "a");

deepEqual({ a: "a", b: "b" }, { a: "a", b: "b" });

class Foo {
  bar() {
    return deepEqual(["a"], ["b"]);
  }
}

{
  deepEqual("x", "y");
}

function x() {
  deepEqual("x", "x");
}
