import ElementRegistry from '../../../chemicals/element-registry';
import Command from '../../command';

export default class GetChemicalCommand extends Command {
  constructor() {
    super('get chemical', 'CHM', 'Get amount of chemical and store in some registry.', 2);
  }

  execute(context) {
    const iterator = context.iterator;

    const chemicalGene = iterator.next().current;

    if (chemicalGene === undefined) {
      return;
    }

    const registryGene = iterator.next().current;

    if (registryGene === undefined) {
      return;
    }

    const element = ElementRegistry.get(chemicalGene.value);
    const amount = context.chemicals.getAmount(element.name);

    context.registries.set(registryGene.value, amount);

    iterator.next();
  }
}
