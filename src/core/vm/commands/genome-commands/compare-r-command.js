import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class CompareRCommand extends Command {
  constructor() {
    super('compare r', 'CMP', 'Description', 2);
  }

  execute(context) {
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
