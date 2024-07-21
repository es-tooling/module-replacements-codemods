var setPrototypeOf = require('setprototypeof');
var assert = require('assert');

function Foo() { }
function Bar() { }

setPrototypeOf(Foo.prototype, Bar.prototype);

const obj = {};
const proto = {};
setPrototypeOf(obj, proto);

function testFunction() {
	const innerObj = {};
	const innerProto = {};
	setPrototypeOf(innerObj, innerProto);
}

const chainExample = setPrototypeOf({}, {}).prop;

setPrototypeOf();
setPrototypeOf({}, {}, 'extra');

assert.strictEqual(Object.getPrototypeOf(Foo.prototype), Bar.prototype);
assert.strictEqual(Object.getPrototypeOf(obj), proto);
