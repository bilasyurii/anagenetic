import Command from '../../command';

export default class NoopCommand extends Command {
  constructor() {
    super('noop');
  }

  execute(context) {
    context.iterator.next();
  }
}
