import Command from '../../command';
import ConditionalCommandUtils from '../../command-utils/conditional-command-utils';

export default class EqualsRRCommand extends Command {
  constructor() {
    super('equals rr', 'EQR', 'Check if values of two registries are equal. If not, advance.', 3);
  }

  execute(context) {
    ConditionalCommandUtils.RRCommand(context, EqualsRRCommand.condition);
  }

  static condition(a, b) {
    return a === b;
  }
}
