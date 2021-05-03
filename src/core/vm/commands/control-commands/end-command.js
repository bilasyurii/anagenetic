import Command from '../../command';

export default class EndCommand extends Command {
  constructor() {
    super('end');
  }

  execute(context) {
    context.iterator.advance(Infinity);
  }
}
