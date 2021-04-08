import Debug from '../../../../anvas/debug/debug';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class EqualsRVCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    ConditionalCommandUtils.RRCommand(context, EqualsRVCommand.condition);
  }

  static condition(a, b) {
    return a === b;
  }
}
