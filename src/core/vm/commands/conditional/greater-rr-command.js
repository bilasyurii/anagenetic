import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class GreaterRRCommand extends Command {
  constructor() {
    super('greater rr', 'GRR', 'Check if value in first registry is greater, than value in second one. If not, advance.', 3);
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, GreaterRRCommand.condition);
  }

  static condition(a, b) {
    return a > b;
  }
}
