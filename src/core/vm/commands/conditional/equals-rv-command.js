import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class EqualsRVCommand extends Command {
  constructor() {
    super('equals rv');
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, EqualsRVCommand.condition);
  }

  static condition(a, b) {
    return a === b;
  }
}
