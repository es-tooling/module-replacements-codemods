import * as deepEqualModule from "deep-equal";

const myDeepEqual = deepEqualModule.default;

myDeepEqual("a", "a");

myDeepEqual({ a: "a", b: "b" }, { a: "a", b: "b" });

class Foo {
  bar() {
    return myDeepEqual(["a"], ["b"]);
  }
}

{
  myDeepEqual("x", "y");
}

function x() {
  myDeepEqual("x", "x");
}
