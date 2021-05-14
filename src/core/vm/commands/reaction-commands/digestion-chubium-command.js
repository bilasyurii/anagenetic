import Command from '../../command';

export default class DigestionChubiumCommand extends Command {
  constructor() {
    super('digestion chubium', 'DGC', 'Description', 0)
  }

  execute(context) {
    const cell = context.cell;
    const chemicals = context.chemicals;

    context.iterator.next();

    if (chemicals.getAmount('chubium') < 1) {
      return false;
    }

    if (cell.energy < 1) {
      return false;
    }

    chemicals.spend('chubium', 1, true);
    chemicals.addSingle('hillagen', 1);
    cell.addEnergy(1);
    context.world.registerEnergyLoss(1);

    return true;
  }
}
