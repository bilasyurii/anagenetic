import Random from '../../utils/random';
import MutationStrategy from './mutation-strategy';

export default class ForceMutationStrategy extends MutationStrategy {
  mutate(genes) {
    const count = genes.length;

    let chancesSum = 0;

    for (let i = 0; i < count; ++i) {
      chancesSum += genes[i].mutationChance;
    }

    const rand = Random.int() % chancesSum;

    let temp = 0;
    let mutated = false;

    for (let i = 0; i < count; ++i) {
      const gene = genes[i];

      if (mutated === true) {
        gene.addStability();

        continue;
      }

      temp += gene.mutationChance;

      if (temp > rand) {
        mutated = true;
        gene.mutate();
      } else {
        gene.addStability();
      }
    }
  }
}
