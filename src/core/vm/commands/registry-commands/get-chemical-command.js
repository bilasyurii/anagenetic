import Debug from '../../../../anvas/debug/debug';

export default class GetChemicalCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;

    const chemicalGene = iterator.next().current;

    if (chemicalGene === undefined) {
      return;
    }

    const registryGene = iterator.next().current;

    if (registryGene === undefined) {
      return;
    }

    const value = context.cell.getChemicalAmount(chemicalGene.value);

    context.registries.set(registryGene.value, value);

    iterator.next();
  }
}
