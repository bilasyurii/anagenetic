import Debug from '../../../../anvas/debug/debug';

export default class CheckCommand {
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

    const angle = angleGene.value;

    iterator.next();

    if (context.cell.check(angle) === true) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
