import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class EqualsRRCommand extends Command {
  constructor() {
    super('equals rr');
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, EqualsRRCommand.condition);
  }

  static condition(a, b) {
    return a === b;
  }
}
