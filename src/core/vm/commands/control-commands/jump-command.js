import Genome from '../../../genome/genome';
import Command from '../../command';

export default class JumpCommand extends Command {
  constructor() {
    super('jump', 'JMP', 'Description', 1);
  }

  execute(context) {
    const iterator = context.iterator;
    const distance = iterator.next().current;

    if (distance !== undefined) {
      iterator.advance((distance % (Genome.GENES_COUNT - 1)) + 1);
    }
  }
}
