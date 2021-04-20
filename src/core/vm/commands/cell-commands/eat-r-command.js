import Debug from '../../../../anvas/debug/debug';

export default class EatRCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;

    context.cell.eat(angle);

    iterator.next();
  }
}