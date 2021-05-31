import Command from '../../command';

export default class IfCommand extends Command {
  constructor() {
    super('if', 'IFF', 'Check if some condition is true. It mustn\'t be zero to be true. If not, advance.', 2);
  }

  execute(context) {
    const iterator = context.iterator;
    const conditionGene = iterator.next().current;

    if (conditionGene === undefined) {
      return;
    }

    const jumpGene = iterator.next().current;

    if (jumpGene === undefined) {
      return;
    }

    const conditionValue = context.registries.get(conditionGene.value).value;

    iterator.next();

    if (conditionValue === 0) {
      iterator.advance(jumpGene.value + 1);
    }
  }
}
