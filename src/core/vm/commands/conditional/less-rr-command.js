import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class LessRRCommand extends Command {
  constructor() {
    super('less rr', 'LER', 'Check if value in first registry is less, than value in second one. If not, advance.', 3);
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, LessRRCommand.condition);
  }

  static condition(a, b) {
    return a < b;
  }
}
