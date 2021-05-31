import Command from '../../command';

export default class DivideCommand extends Command {
  constructor() {
    super('divide', 'DIV', 'Try to divide a cell.', 0);
  }

  execute(context) {
    const iterator = context.iterator;

    context.cell.divide();

    iterator.next();
  }
}
