import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class SpreadCommand extends Command {
  constructor() {
    super('spread', 'SPR', 'Spread some chemical in some direction.', 2);
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

    const angle = angleGene.value;

    context.cell.spawnChemical(chemicalGene.value, angle * VMUtils.VM2RAD);

    iterator.next();
  }
}