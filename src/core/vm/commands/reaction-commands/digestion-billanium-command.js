import Command from '../../command';

export default class DigestionBillaniumCommand extends Command {
  constructor() {
    super('digestion billanium', 'DGB', 'Description', 0)
  }

  execute(context) {
    const cell = context.cell;
    const chemicals = context.chemicals;

    context.iterator.next();

    if (chemicals.getAmount('hillagen') < 1) {
      return false;
    }

    if (chemicals.getAmount('billanium') < 1) {
      return false;
    }

    if (cell.energy < 1) {
      return false;
    }

    chemicals.spend('hillagen', 1, true);
    chemicals.spend('billanium', 1);
    cell.addEnergy(2.5);
    context.world.registerEnergyLoss(0.5);

    return true;
  }
}
