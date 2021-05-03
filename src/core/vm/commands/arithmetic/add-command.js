import Gene from '../../../genome/gene';
import Command from '../../command';

export default class AddCommand extends Command {
  constructor() {
    super('add');
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

    let result = leftGene.value + rightGene.value;

    if (result > Gene.MAX_VAL) {
      result -= Gene.MAX_VAL;
    }

    context.registries.set(targetGene.value, result);

    iterator.next();
  }
}
