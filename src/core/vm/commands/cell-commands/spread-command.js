import Debug from '../../../../anvas/debug/debug';

export default class SpreadCommand {
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

    const angle = angleGene.value;

    context.cell.spawnChemical(chemicalGene.value, angle);

    iterator.next();
  }
}