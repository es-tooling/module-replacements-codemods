import setprototypeof from 'setprototypeof';
import assert from 'assert';

function Foo() { }
function Bar() { }

setprototypeof(Foo.prototype, Bar.prototype);

const obj = {};
const proto = {};
setprototypeof(obj, proto);

function testFunction() {
	const innerObj = {};
	const innerProto = {};
	setprototypeof(innerObj, innerProto);
}

const chainExample = setprototypeof({}, {}).prop;

setprototypeof();
setprototypeof({}, {}, 'extra');

assert.strictEqual(Object.getPrototypeOf(Foo.prototype), Bar.prototype);
assert.strictEqual(Object.getPrototypeOf(obj), proto);
