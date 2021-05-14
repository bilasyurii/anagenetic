import Command from '../../command';

export default class EndCommand extends Command {
  constructor() {
    super('end', 'END', 0);
  }

  execute(context) {
    context.iterator.advance(Infinity);
  }
}
