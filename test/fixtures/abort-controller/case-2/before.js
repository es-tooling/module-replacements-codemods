import AbortControllerPolyfill from "abort-controller";

const controller = new AbortControllerPolyfill();
const signal = controller.signal;

signal.addEventListener("abort", () => {
  console.log("aborted!");
});

controller.abort();
