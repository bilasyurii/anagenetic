import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class GreaterRRCommand extends Command {
  constructor() {
    super('greater rr');
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, GreaterRRCommand.condition);
  }

  static condition(a, b) {
    return a > b;
  }
}
