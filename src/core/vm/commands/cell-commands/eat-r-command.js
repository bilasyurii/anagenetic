import VMUtils from '../../../utils/vm-utils';
import Command from '../../command';

export default class EatRCommand extends Command {
  constructor() {
    super('eat r', 'EAT', 'Try to eat something in direction, stored in registry.', 1);
  }

  execute(context) {
    const iterator = context.iterator;
    const angleGene = iterator.next().current;

    if (angleGene === undefined) {
      return;
    }

    const angle = context.registries.get(angleGene.value).value;

    context.cell.eat(angle * VMUtils.VM2RAD);

    iterator.next();
  }
}