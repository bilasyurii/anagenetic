import Debug from '../../../../anvas/debug/debug';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class GreaterRVCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    ConditionalCommandUtils.RVCommand(context, GreaterRVCommand.condition);
  }

  static condition(a, b) {
    return a > b;
  }
}
