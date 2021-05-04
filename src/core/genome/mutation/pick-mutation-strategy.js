import Random from '../../utils/random';
import Gene from '../gene';
import MutationStrategy from './mutation-strategy';

export default class PickMutationStrategy extends MutationStrategy {
  mutate(genes) {
    const index = Random.int() % genes.length;
    const gene = genes[index];
    const rand = Random.int() % PickMutationStrategy.MAX_MUTATION_VALUE;

    if (rand < gene.mutationChance) {
      gene.addStability();
    } else {
      gene.mutate();
    }
  }
}

PickMutationStrategy.MAX_MUTATION_VALUE = Gene.MAX_MUTATION_VALUE * 2;
