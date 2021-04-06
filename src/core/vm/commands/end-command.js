import Debug from '../../../anvas/debug/debug';

export default class EndCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    console.log('end');
    context.iterator.advance(Infinity);
  }
}
