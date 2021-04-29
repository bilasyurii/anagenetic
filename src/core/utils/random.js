import Debug from '../../anvas/debug/debug';

export default class Random {
  constructor() {
    Debug.staticClass();
  }

  static int() {
    return (this._value = (this._value * 16807 + 17711) % 2147483647);
  }

  static float() {
    return Random.int() * Random._maxInv;
  }

  static bool() {
    return (Random.int() & 1 === 0);
  }

  static sign() {
    return (Random.int() & 1 === 0 ? 1 : -1);
  }

  static between(a, b) {
    return Random.float() * (b - a) + a;
  }

  static setSeed(value) {
    Random._seed = value;
    Random._value = value;
  }

  static getSeed() {
    return Random._seed;
  }
}

Random._seed = 0;
Random._value = 0;
Random._maxInv = 1 / 2147483647;
