import { dequal } from "dequal";

dequal("a", "a");

dequal({ a: "a", b: "b" }, { a: "a", b: "b" });

class Foo {
  bar() {
    return dequal(["a"], ["b"]);
  }
}

{
  dequal("x", "y");
}

function x() {
  dequal("x", "x");
}
