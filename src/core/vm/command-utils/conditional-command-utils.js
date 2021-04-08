import Debug from '../../../anvas/debug/debug';

export default class ConditionalCommandUtils {
  constructor() {
    Debug.staticClass();
  }

  static RRCommand(context, condition) {
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
    const rightValue = registries.get(rightGene.value);

    iterator.next();

    if (condition(leftValue, rightValue) === false) {
      iterator.advance(jumpGene.value + 1);
    }
  }

  static RVCommand(context, condition) {
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

    if (condition(leftValue, rightValue) === false) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
