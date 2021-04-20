import Debug from '../../../../anvas/debug/debug';

export default class GetCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const registryGene = iterator.next().current;

    if (registryGene === undefined) {
      return;
    }

    const memoryGene = iterator.next().current;

    if (memoryGene === undefined) {
      return;
    }

    const value = context.memory.getByte(memoryGene.value);

    context.registries.set(registryGene.value, value);

    iterator.next();
  }
}
