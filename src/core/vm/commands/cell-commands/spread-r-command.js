import Debug from '../../../../anvas/debug/debug';
import VMUtils from '../../../utils/vm-utils';

export default class SpreadRCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
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