import Command from '../../command';

export default class GetCommand extends Command {
  constructor() {
    super('get', 'GET', 'Get data from memory and story into a registry.', 2);
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

    const value = context.memory.getByte(memoryGene.value);

    context.registries.set(registryGene.value, value);

    iterator.next();
  }
}
