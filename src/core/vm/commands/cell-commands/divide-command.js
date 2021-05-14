import Command from '../../command';

export default class DivideCommand extends Command {
  constructor() {
    super('divide', 'DIV', 'Description', 0);
  }

  execute(context) {
    const iterator = context.iterator;

    context.cell.divide();

    iterator.next();
  }
}
