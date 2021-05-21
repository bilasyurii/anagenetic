import Observable from '../../anvas/events/observable';
import ArrayUtils from '../../anvas/utils/array-utils';

export default class GenomeLibraryService {
  constructor() {
    this.onChanges = new Observable();

    this._genomes = [];
  }

  get genomes() {
    return this._genomes;
  }

  addGenome(genome) {
    this._genomes.push(genome);
    this.onChanges.post();

    return this;
  }

  addGenomes(genomes) {
    const destination = this._genomes;
    const count = genomes.length;

    for (let i = 0; i < count; ++i) {
      destination.push(genomes[i]);
    }

    this.onChanges.post();

    return this;
  }

  removeGenome(genome) {
    ArrayUtils.removeByValue(this._genomes, genome);
    this.onChanges.post();

    return this;
  }

  removeAll() {
    this._genomes = [];
    this.onChanges.post();

    return this;
  }
}
