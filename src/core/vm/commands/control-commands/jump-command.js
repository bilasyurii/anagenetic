import Command from '../../command';

export default class JumpCommand extends Command {
  constructor() {
    super('jump');
  }

  execute(context) {
    const iterator = context.iterator;
    const distance = iterator.next().current;

    if (distance !== undefined) {
      iterator.advance(distance);
    }
  }
}
