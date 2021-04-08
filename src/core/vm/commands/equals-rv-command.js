import Debug from '../../../anvas/debug/debug';

export default class EqualsRVCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const leftGene = iterator.next().current;

    if (leftGene === undefined) {
      return;
    }

    const rightGene = iterator.next().current;

    if (rightGene === undefined) {
      return;
    }

    const jumpGene = iterator.next().current;

    if (jumpGene === undefined) {
      return;
    }

    const registries = context.registries;
    const leftValue = registries.get(leftGene.value);
    const rightValue = rightGene.value;

    iterator.next();

    if (leftValue !== rightValue) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
