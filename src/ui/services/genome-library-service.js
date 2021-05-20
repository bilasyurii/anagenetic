import Observable from '../../anvas/events/observable';

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
}
