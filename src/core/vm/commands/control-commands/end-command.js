import Debug from '../../../../anvas/debug/debug';

export default class EndCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    context.iterator.advance(Infinity);
  }
}
