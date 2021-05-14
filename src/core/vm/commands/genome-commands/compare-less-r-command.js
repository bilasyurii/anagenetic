import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class CompareLessRCommand extends Command {
  constructor() {
    super('compare less r', 'CML', 'Description', 3);
  }

  execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const valueGene = iterator.next().current;

    if (valueGene === undefined) {
      return;
    }

    const jumpGene = iterator.next().current;

    if (jumpGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;
    const difference = context.cell.compare(angle * VMUtils.VM2RAD);

    iterator.next();

    if (difference < valueGene) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
