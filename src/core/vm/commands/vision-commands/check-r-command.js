import Debug from '../../../../anvas/debug/debug';

export default class CheckRCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const jumpGene = iterator.next().current;

    if (jumpGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;

    iterator.next();

    if (context.cell.check(angle) === true) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
