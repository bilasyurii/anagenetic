import Debug from '../anvas/debug/debug';

export default class StringUtils {
  constructor() {
    Debug.staticClass();
  }

  static capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
}
