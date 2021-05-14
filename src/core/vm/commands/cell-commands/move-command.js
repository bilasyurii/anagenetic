import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class MoveCommand extends Command {
  constructor() {
    super('move', 'MOV', 1);
  }

  execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const angle = angleGene.value;

    context.cell.move(angle * VMUtils.VM2RAD);

    iterator.next();
  }
}
