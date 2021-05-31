import Command from '../../command';

export default class DefragmentationChubiumCommand extends Command {
  constructor() {
    super('defragmentation chubium', 'DFC', 'Turn chubium into dion.', 0)
  }

  execute(context) {
    const cell = context.cell;
    const chemicals = context.chemicals;

    context.iterator.next();

    if (chemicals.getAmount('chubium') < 1) {
      return false;
    }

    if (cell.energy < 2) {
      return false;
    }

    chemicals.spend('chubium', 1, true);
    chemicals.addSingle('dion', 1);
    cell.reduceEnergy(2);
    context.world.registerEnergyLoss(1);

    return true;
  }
}
