import Gene from './gene';
import GenomeIterator from './genome-iterator';
import MutationStrategy from './mutation/mutation-strategy';

export default class Genome {
  constructor(genes) {
    this.name = '';
    this.createdDate = null

    this._genes = genes;
  }

  get iterator() {
    return new GenomeIterator(this._genes);
  }

  compare(other) {
    const otherGenes = other._genes;
    const genes = this._genes;
    const count = genes.length;

    let result = 0;

    for (let i = 0; i < count; ++i) {
      if (genes[i].value !== otherGenes[i].value) {
        ++result;
      }
    }

    return result;
  }

  mutate() {
    MutationStrategy.mutate(this._genes);

    return this;
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

  genesToString() {
    let str = '';

    const genes = this._genes;
    const count = genes.length;

    for (let i = 0; i < count; ++i) {
      str += ('00' + genes[i].value).slice(-3);
    }

    return str;
  }

  serialize() {
    const obj = {};
    const genesData = [];

    obj.name = this.name;
    obj.createdDate = this.createdDate;
    obj.genes = genesData;

    const genes = this._genes;
    const count = genes.length;

    for (let i = 0; i < count; ++i) {
      genesData.push(genes[i].value);
    }

    return JSON.stringify(obj);
  }

  randomize() {
    const genes = this._genes;
    const count = genes.length;

    for (let i = 0; i < count; ++i) {
      genes[i].randomize();
    }

    return this;
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

  static zero() {
    const genes = [];
    const count = Genome.GENES_COUNT;

    for (let i = 0; i < count; ++i) {
      genes.push(new Gene(0));
    }

    return new Genome(genes);
  }
}

Genome.GENES_COUNT = 64;
