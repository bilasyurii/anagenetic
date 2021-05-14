import Command from '../../command';

export default class DigestionHillagenCommand extends Command {
  constructor() {
    super('digestion hillagen', 'DGH', 'Description', 0)
  }

  execute(context) {
    const cell = context.cell;
    const chemicals = context.chemicals;

    context.iterator.next();

    if (chemicals.getAmount('hillagen') < 3) {
      return false;
    }

    if (cell.energy < 1) {
      return false;
    }

    chemicals.spend('hillagen', 2);
    cell.addEnergy(1);
    context.world.registerEnergyLoss(1);

    return true;
  }
}
