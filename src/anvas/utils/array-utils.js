export default class ArrayUtils {
  static find(array, expression) {
    const length = array.length;

    for (let i = 0; i < length; ++i) {
      const element = array[i];

      if (expression(element, i)) {
        return element;
      }
    }

    return null;
  }

  static findIndex(array, expression) {
    const length = array.length;

    for (let i = 0; i < length; ++i) {
      if (expression(array[i], i)) {
        return i;
      }
    }

    return -1;
  }

  static findByValue(array, element) {
    const length = array.length;

    for (let i = 0; i < length; ++i) {
      if (array[i] === element) {
        return i;
      }
    }

    return -1;
  }

  static findAll(array, expression) {
    const found = [];
    const length = array.length;

    for (let i = 0; i < length; ++i) {
      const element = array[i];

      if (expression(element, i)) {
        found.push(element);
      }
    }

    return found;
  }

  static containsAll(array, input) {
    const length = array.length;
    const inputLength = input.length;

    if (length < inputLength) {
      return false;
    }

    for (let i = 0; i < inputLength; ++i) {
      if (ArrayUtils.findByValue(array, input[i]) < 0) {
        return false;
      }
    }

    return true;
  }

  static randomItem(array) {
    return array[~~(array.length * Math.random())];
  }

  static removeByValue(array, item) {
    const index = ArrayUtils.findByValue(array, item);

    if (index < 0) {
      return false;
    }
    
    array.splice(index, 1);

    return true;
  }

  static remove(array, expression) {
    const index = ArrayUtils.findIndex(array, expression);

    if (index < 0) {
      return null;
    }
    
    return array.splice(index, 1)[0];
  }

  static forEach(array, expression) {
    const length = array.length;

    for (let i = 0; i < length; ++i) {
      expression(array[i]);
    }

    return array;
  }
}
