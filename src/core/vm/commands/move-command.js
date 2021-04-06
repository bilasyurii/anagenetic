import Debug from '../../../anvas/debug/debug';
import VMUtils from '../../utils/vm-utils';

export default class MoveCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene !== undefined) {
      const angle = angleGene.value;

      context.cell.move(angle * VMUtils.VM2RAD);
    }

    iterator.next();
  }
}
