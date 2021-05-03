import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class SpreadRCommand extends Command {
  constructor() {
    super('spread r');
  }

  execute(context) {
    const iterator = context.iterator;

    const chemicalGene = iterator.next().current;

    if (chemicalGene === undefined) {
      return;
    }

    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;

    context.cell.spawnChemical(chemicalGene.value, angle * VMUtils.VM2RAD);

    iterator.next();
  }
}