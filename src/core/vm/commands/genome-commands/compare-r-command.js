import Debug from '../../../../anvas/debug/debug';
import VMUtils from '../../../utils/vm-utils';

export default class CompareRCommand {
  constructor() {
    Debug.staticClass();
  }

  static execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const registryGene = iterator.next().current;

    if (registryGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;
    const difference = context.cell.compare(angle * VMUtils.VM2RAD);

    context.registries.set(registryGene.value, difference);

    iterator.next();
  }
}
