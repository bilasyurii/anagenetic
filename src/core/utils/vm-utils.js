import Debug from '../../anvas/debug/debug';

export default class VMUtils {
  constructor() {
    Debug.staticClass();
  }

  static getDirection(angle, target) {
    const radians = angle * VMUtils.VM2RAD;

    target.set(Math.cos(radians), Math.sin(radians));

    return target;
  }
}

VMUtils.VM2RAD = Math.PI / 128;
