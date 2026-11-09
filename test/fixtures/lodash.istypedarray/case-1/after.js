

const a = (ArrayBuffer.isView(val) && !(val instanceof DataView));
const b = !(ArrayBuffer.isView(other) && !(other instanceof DataView));
