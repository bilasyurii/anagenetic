import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class GreaterRVCommand extends Command {
  constructor() {
    super('greater rv', 'GRV', 3);
  }

  execute(context) {
    ConditionalCommandUtils.RVCommand(context, GreaterRVCommand.condition);
  }

  static condition(a, b) {
    return a > b;
  }
}
