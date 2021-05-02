import Debug from '../../../../anvas/debug/debug';
import ElementRegistry from '../../../chemicals/element-registry';

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

    const element = ElementRegistry.get(chemicalGene.value);
    const amount = context.chemicals.getAmount(element.name);

    context.registries.set(registryGene.value, amount);

    iterator.next();
  }
}
