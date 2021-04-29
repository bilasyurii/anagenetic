import Debug from '../../../../anvas/debug/debug';

export default class DivideCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;

    context.cell.divide();

    iterator.next();
  }
}
