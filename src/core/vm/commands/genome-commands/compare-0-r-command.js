import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class Compare0RCommand extends Command {
  constructor() {
    super('compare 0 r');
  }

  execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const jumpGene = iterator.next().current;

    if (jumpGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;
    const difference = context.cell.compare(angle * VMUtils.VM2RAD);

    iterator.next();

    if (difference === 0) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
