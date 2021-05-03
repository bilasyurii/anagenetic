import Command from '../../command';

export default class DefragmentationBillaniumCommand extends Command {
  constructor() {
    super('defragmentation billanium')
  }

  execute(context) {
    const cell = context.cell;
    const chemicals = context.chemicals;

    context.iterator.next();

    if (chemicals.getAmount('billanium') < 1) {
      return false;
    }

    if (cell.energy < 3) {
      return false;
    }

    chemicals.spend('billanium', 1, true);
    chemicals.addSingle('dion', 1);
    cell.reduceEnergy(3);
    context.world.registerEnergyLoss(1);

    return true;
  }
}
