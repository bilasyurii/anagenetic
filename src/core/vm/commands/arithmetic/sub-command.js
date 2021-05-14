import Gene from '../../../genome/gene';
import Command from '../../command';

export default class SubCommand extends Command {
  constructor() {
    super('sub', 'SUB', 'Description', 3);
  }

  execute(context) {
    const iterator = context.iterator;
    const leftGene = iterator.next().current;

    if (leftGene === undefined) {
      return;
    }

    const rightGene = iterator.next().current;

    if (rightGene === undefined) {
      return;
    }

    const targetGene = iterator.next().current;

    if (targetGene === undefined) {
      return;
    }

    let result = leftGene.value - rightGene.value;

    if (result < 0) {
      result += Gene.MAX_VAL;
    }

    context.registries.set(targetGene.value, result);

    iterator.next();
  }
}
