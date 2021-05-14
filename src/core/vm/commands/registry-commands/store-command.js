import Command from '../../command';

export default class StoreCommand extends Command {
  constructor() {
    super('store', 'STR', 2);
  }

  execute(context) {
    const iterator = context.iterator;
    const registryGene = iterator.next().current;

    if (registryGene === undefined) {
      return;
    }

    const memoryGene = iterator.next().current;

    if (memoryGene === undefined) {
      return;
    }

    const value = context.registries.get(registryGene.value).value;

    context.memory.setByte(memoryGene.value, value);

    iterator.next();
  }
}
