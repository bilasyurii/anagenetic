import Debug from '../../../../anvas/debug/debug';
import VMUtils from '../../../utils/vm-utils';

export default class MoveRCommand {
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

    context.cell.move(angle * VMUtils.VM2RAD);

    iterator.next();
  }
}