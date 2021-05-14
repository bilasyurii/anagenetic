import Command from '../../command';

export default class PhotosynthesisCommand extends Command {
  constructor() {
    super('photosynthesis', 'PHO', 'Description', 0)
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
