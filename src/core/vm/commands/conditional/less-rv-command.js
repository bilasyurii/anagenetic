import Debug from '../../../../anvas/debug/debug';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class LessRVCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    ConditionalCommandUtils.RVCommand(context, LessRVCommand.condition);
  }

  static condition(a, b) {
    return a < b;
  }
}
