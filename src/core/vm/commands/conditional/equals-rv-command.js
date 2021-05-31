import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class EqualsRVCommand extends Command {
  constructor() {
    super('equals rv', 'EQV', 'Check if values in registry is equal to some value. If not, advance.', 3);
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, EqualsRVCommand.condition);
  }

  static condition(a, b) {
    return a === b;
  }
}
