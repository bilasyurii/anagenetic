import Command from '../../command';

export default class FragmentationHillagenCommand extends Command {
  constructor() {
    super('fragmentation hillagen')
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
    chemicals.addSingle('hillagen', 1);
    cell.addEnergy(2.5);
    context.world.registerEnergyLoss(0.5);

    return true;
  }
}
