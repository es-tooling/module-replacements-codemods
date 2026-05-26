

var obj = {
  foo: 42,
};

console.log(typeof Object.getOwnPropertyDescriptor);
console.log(Object.getOwnPropertyDescriptor(obj, "foo").value);
