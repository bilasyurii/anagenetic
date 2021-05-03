import Command from '../../command';

export default class DivideCommand extends Command {
  constructor() {
    super('divide');
  }

  execute(context) {
    const iterator = context.iterator;

    context.cell.divide();

    iterator.next();
  }
}
