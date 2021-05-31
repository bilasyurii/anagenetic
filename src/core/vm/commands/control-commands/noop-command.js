import Command from '../../command';

export default class NoopCommand extends Command {
  constructor() {
    super('noop', 'NOP', 'Do nothing.', 0);
  }

  execute(context) {
    context.iterator.next();
  }
}
