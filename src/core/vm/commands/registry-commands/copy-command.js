import Debug from '../../../../anvas/debug/debug';

export default class CopyCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const sourceGene = iterator.next().current;

    if (sourceGene === undefined) {
      return;
    }

    const destinationGene = iterator.next().current;

    if (destinationGene === undefined) {
      return;
    }

    const registries = context.registries;
    const sourceValue = registries.get(sourceGene.value).value;

    registries.set(destinationGene.value, sourceValue);

    iterator.next();
  }
}
