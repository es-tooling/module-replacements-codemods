

if (error) {
  throw error;
}
if (new Error("failure")) {
  throw new Error("failure");
}
