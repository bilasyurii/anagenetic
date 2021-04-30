import Debug from '../../../../anvas/debug/debug';
import VMUtils from '../../../utils/vm-utils';

export default class DistinguishRCommand {
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
    const type = context.cell.distinguish(angle * VMUtils.VM2RAD);

    context.registries.set(registryGene.value, type);

    iterator.next();
  }
}
