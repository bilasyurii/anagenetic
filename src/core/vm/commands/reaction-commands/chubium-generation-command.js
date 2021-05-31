import Command from '../../command';

export default class ChubiumGenerationCommand extends Command {
  constructor() {
    super('chubium generation', 'CHU', 'Generate chubium from hillagen.', 0)
  }

  execute(context) {
    const cell = context.cell;
    const chemicals = context.chemicals;

    context.iterator.next();

    if (chemicals.getAmount('hillagen') < 2) {
      return false;
    }

    if (cell.energy < 3) {
      return false;
    }

    chemicals.spend('hillagen', 2, true);
    chemicals.addSingle('chubium', 1);
    cell.reduceEnergy(3);
    context.world.registerEnergyLoss(2);

    return true;
  }
}
