import Command from '../../command';

export default class PhotosynthesisCommand extends Command {
  constructor() {
    super('photosynthesis')
  }

  execute(context) {
    const chubiumAmount = context.chemicals.getAmount('dion');

    context.iterator.next();

    if (chubiumAmount < 1) {
      return false;
    }

    context.cell.addEnergy(chubiumAmount);

    return true;
  }
}
