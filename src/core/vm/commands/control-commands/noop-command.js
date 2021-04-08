import Debug from '../../../../anvas/debug/debug';

export default class NoopCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    context.iterator.next();
  }
}
