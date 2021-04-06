export default class GenomeIterator {
  constructor(genes) {
    this._genes = genes;
    this._index = 0;
  }

  get current() {
    return this._genes[this._index];
  }

  get hasNext() {
    return this._index < this._genes.length - 1;
  }

  next() {
    ++this._index;

    return this;
  }

  reset() {
    this._index = 0;

    return this;
  }

  advance(amount) {
    this._index += amount;

    return this;
  }
}
