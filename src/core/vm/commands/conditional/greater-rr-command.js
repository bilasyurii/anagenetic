import Debug from '../../../../anvas/debug/debug';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class GreaterRRCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    ConditionalCommandUtils.RRCommand(context, GreaterRRCommand.condition);
  }

  static condition(a, b) {
    return a > b;
  }
}
