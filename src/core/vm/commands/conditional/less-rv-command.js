import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class LessRVCommand extends Command {
  constructor() {
    super('less rv')
  }

  execute(context) {
    ConditionalCommandUtils.RVCommand(context, LessRVCommand.condition);
  }

  static condition(a, b) {
    return a < b;
  }
}
