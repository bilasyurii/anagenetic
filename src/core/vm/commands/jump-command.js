import Debug from '../../../anvas/debug/debug';

export default class JumpCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    console.log('jump');
    context.iterator.next();
  }
}
