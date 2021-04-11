import Debug from '../../../../anvas/debug/debug';

export default class IfCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {const iterator = context.iterator;
    const conditionGene = iterator.next().current;

    if (conditionGene === undefined) {
      return;
    }

    const jumpGene = iterator.next().current;

    if (jumpGene === undefined) {
      return;
    }

    const conditionValue = context.registries.get(conditionGene.value).value;

    iterator.next();

    if (conditionValue === 0) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
