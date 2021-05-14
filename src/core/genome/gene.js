import Random from '../utils/random';

export default class Gene {
  constructor(value, mutationChance) {
    this.value = (value === undefined ? 0 : value);
    this.mutationChance = (mutationChance === undefined ? Gene.MAX_MUTATION_VALUE : mutationChance);
    this.command = null;
  }

  get mnemonic() {
    return (this.command === null ? '---' : this.command.mnemonic);
  }

  mutate() {
    let newValue = Random.int() % Gene.VARIETY;

    if (newValue === this.value) {
      if (newValue === Gene.MAX_VAL) {
        newValue = 0;
      } else {
        ++newValue;
      }
    }

    this.value = newValue;
    this.mutationChance = Gene.MAX_MUTATION_VALUE;

    return this;
  }

  addStability() {
    const current = this.mutationChance;

    if (current !== 1) {
      this.mutationChance = current - 1;
    }

    return this;
  }

  clone() {
    return new Gene(this.value, this.mutationChance);
  }

  static random() {
    const value = Random.int() % Gene.VARIETY;

    return new Gene(value);
  }
}

Gene.VARIETY = 256;
Gene.MAX_VAL = Gene.VARIETY - 1;
Gene.MAX_MUTATION_VALUE = 60;
