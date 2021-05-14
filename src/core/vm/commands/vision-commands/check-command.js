import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class CheckCommand extends Command {
  constructor() {
    super('check', 'CHE', 'Description', 2);
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

    const angle = angleGene.value;

    iterator.next();

    if (context.cell.check(angle * VMUtils.VM2RAD) === true) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
