import assert from 'assert';

function Foo() { }
function Bar() { }

Object.setPrototypeOf(Foo.prototype, Bar.prototype);

const obj = {};
const proto = {};
Object.setPrototypeOf(obj, proto);

function testFunction() {
	const innerObj = {};
	const innerProto = {};
	Object.setPrototypeOf(innerObj, innerProto);
}

const chainExample = Object.setPrototypeOf({}, {}).prop;

Object.setPrototypeOf();
Object.setPrototypeOf({}, {}, 'extra');

assert.strictEqual(Object.getPrototypeOf(Foo.prototype), Bar.prototype);
assert.strictEqual(Object.getPrototypeOf(obj), proto);
