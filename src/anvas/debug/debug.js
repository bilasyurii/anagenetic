export default class Debug {
  constructor() {
    Debug.staticClass();
  }

  static assert(expression) {
    if (expression !== true) {
      throw new Error(`Assertion failed.`);
    }
  }

  static defined(expression) {
    if (expression === undefined || expression === null) {
      throw new Error(`Expression is not defined.`);
    }
  }

  static fail(message) {
    throw new Error(message);
  }

  static staticClass() {
    throw new Error(`Can't create an instance of a static class.`);
  }

  static abstractMethod() {
    throw new Error(`Abstract method wasn't overridden.`);
  }
}
