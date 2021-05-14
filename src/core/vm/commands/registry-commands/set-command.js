import Command from '../../command';

export default class SetCommand extends Command {
  constructor() {
    super('set', 'SET', 2);
  }

  execute(context) {
    const iterator = context.iterator;
    const registryGene = iterator.next().current;

    if (registryGene === undefined) {
      return;
    }

    const valueGene = iterator.next().current;

    if (valueGene === undefined) {
      return;
    }

    context.registries.set(registryGene.value, valueGene.value);

    iterator.next();
  }
}
