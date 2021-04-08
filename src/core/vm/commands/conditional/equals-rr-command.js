import Debug from '../../../../anvas/debug/debug';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class EqualsRRCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    ConditionalCommandUtils.RRCommand(context, EqualsRRCommand.condition);
  }

  static condition(a, b) {
    return a === b;
  }
}
