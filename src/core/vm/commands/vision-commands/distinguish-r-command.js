import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class DistinguishRCommand extends Command {
  constructor() {
    super('distinguish r');
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
    const type = context.cell.distinguish(angle * VMUtils.VM2RAD);

    context.registries.set(registryGene.value, type);

    iterator.next();
  }
}
