

const val = {};
const result = val && typeof val === "object" && (Object.getPrototypeOf(val) === null || Object.getPrototypeOf(val) === Object.prototype);
