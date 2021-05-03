import Command from '../../command';

export default class FragmentationBillaniumCommand extends Command {
  constructor() {
    super('fragmentation billanium')
  }

  execute(context) {
    const cell = context.cell;
    const chemicals = context.chemicals;

    context.iterator.next();

    if (chemicals.getAmount('dion') < 1) {
      return false;
    }

    if (cell.energy < 1) {
      return false;
    }

    chemicals.spend('dion', 1, true);
    chemicals.addSingle('billanium', 1);
    cell.addEnergy(1);
    context.world.registerEnergyLoss(1);

    return true;
  }
}
