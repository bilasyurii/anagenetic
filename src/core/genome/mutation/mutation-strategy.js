import Debug from '../../../anvas/debug/debug';

export default class MutationStrategy {
  mutate(genes) {
    Debug.abstractMethod();
  }

  static mutate(genes) {
    MutationStrategy._active.mutate(genes);
  }

  static setActive(strategy) {
    MutationStrategy._active = strategy;
  }
}

MutationStrategy._active = null;
