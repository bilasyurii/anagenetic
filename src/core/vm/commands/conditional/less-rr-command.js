import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class LessRRCommand extends Command {
  constructor() {
    super('less rr');
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, LessRRCommand.condition);
  }

  static condition(a, b) {
    return a < b;
  }
}
