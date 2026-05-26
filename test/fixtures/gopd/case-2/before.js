import gOPD from "gopd";

var obj = {
  foo: 42,
};

console.log(typeof gOPD);
console.log(gOPD(obj, "foo").value);
