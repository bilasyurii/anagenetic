import Debug from '../../../../anvas/debug/debug';
import VMUtils from '../../../utils/vm-utils';

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

    if (context.cell.check(angle * VMUtils.VM2RAD) === true) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}