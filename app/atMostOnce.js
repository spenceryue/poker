export const atMostOnce = (fn, didRun = false) => (...args) => !didRun && (didRun = true, fn(...args));
