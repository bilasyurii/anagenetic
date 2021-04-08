import Debug from '../../../anvas/debug/debug';

export default class SetCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const registryGene = iterator.next().current;

    if (registryGene === undefined) {
      return;
    }

    const valueGene = iterator.next().current;

    if (valueGene === undefined) {
      return;
    }

    context.registries.set(registryGene.value, valueGene.value);

    iterator.next();
  }
}
