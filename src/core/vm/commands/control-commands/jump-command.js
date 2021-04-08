import Debug from '../../../../anvas/debug/debug';

export default class JumpCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const distance = iterator.next().current;

    if (distance !== undefined) {
      iterator.advance(distance);
    }
  }
}
