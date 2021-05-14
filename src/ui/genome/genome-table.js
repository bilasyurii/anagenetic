import UIElement from '../core/ui-element';
import GeneItem from './gene-item';
import VM from '../../core/vm/vm';

export default class GenomeTable extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.genome = null;
    this.iterator = null;

    this.grid = [];
    this.genes = [];

    this._initGrid();
  }

  setFromGenome(genome) {
    this.genome = genome;

    const genes = this.genes;
    const iterator = this.iterator = genome.iterator;

    let i = 0;
    iterator.reset();

    while(iterator.hasCurrent === true) {
      genes[i].setGene(iterator.current);
      iterator.next();
      ++i;
    }

    this.updateGenes();
  }

  updateGenes() {
    const genes = this.genes;
    const count = genes.length;

    VM.describeGenome(this.iterator);

    for (let i = 0; i < count; ++i) {
      genes[i].update();
    }
  }

  _initGrid() {
    const grid = this.grid;
    const genes = this.genes;
    const rows = 8;
    const cols = 8;

    for (let i = 0; i < rows; ++i) {
      const row = [];

      grid.push(row);

      for (let j = 0; j < cols; ++j) {
        const gene = this._initGene();

        this.add(gene);
        row.push(gene);
        genes.push(gene);
      }
    }
  }

  _initGene() {
    return this.create
      .custom('gene-item', GeneItem);
  }
}
