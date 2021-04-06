import Gene from './gene';
import GenomeIterator from './genome-iterator';

export default class Genome {
  constructor(genes) {
    this._genes = genes;
  }

  get iterator() {
    return new GenomeIterator(this._genes);
  }

  clone() {
    const genesCopy = [];
    const genes = this._genes;
    const count = genes.length;

    for (let i = 0; i < count; ++i) {
      genesCopy.push(genes[i].clone());
    }

    return new Genome(genesCopy);
  }

  static random() {
    const genes = [];
    const count = Genome.GENES_COUNT;
    const randomGene = Gene.random;

    for (let i = 0; i < count; ++i) {
      genes.push(randomGene());
    }

    return new Genome(genes);
  }
}

Genome.GENES_COUNT = 64;
