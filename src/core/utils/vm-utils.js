import Debug from '../../anvas/debug/debug';
import Random from './random';

export default class VMUtils {
  constructor() {
    Debug.staticClass();
  }

  static getDirection(angle, target) {
    const radians = angle * VMUtils.VM2RAD;

    target.set(Math.cos(radians), Math.sin(radians));

    return target;
  }

  static angleFromVec(vec) {
    return (~~(vec.radians() * VMUtils.RAD2VM + 256.5)) % 256;
  }

  static randomDirection(target) {
    return VMUtils.getDirection(Random.int() & 255, target);
  }
}

VMUtils.VM2RAD = Math.PI / 128;
VMUtils.RAD2VM = 128 / Math.PI;
