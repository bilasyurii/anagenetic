import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class CheckRCommand extends Command {
  constructor() {
    super('check r');
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

    iterator.next();

    if (context.cell.check(angle * VMUtils.VM2RAD) === true) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
