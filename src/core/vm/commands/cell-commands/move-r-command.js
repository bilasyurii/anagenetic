import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class MoveRCommand extends Command {
  constructor() {
    super('move r', 'MVR', 'Description', 1);
  }

  execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;

    context.cell.move(angle * VMUtils.VM2RAD);

    iterator.next();
  }
}