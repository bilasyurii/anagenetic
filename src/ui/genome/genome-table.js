import UIElement from '../core/ui-element';
import GeneItem from './gene-item';
import VM from '../../core/vm/vm';
import Observable from '../../anvas/events/observable';

export default class GenomeTable extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onGeneClicked = new Observable();

    this.genome = null;
    this.iterator = null;

    this.grid = [];
    this.genes = [];

    this._initGrid();
  }

  getByIndex(index) {
    return this.genes[index];
  }

  setGenesState(state) {
    const genes = this.genes;
    const count = genes.length;

    for (let i = 0; i < count; ++i) {
      genes[i].setState(state);
    }
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

    return this;
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

    let index = 0;

    for (let i = 0; i < rows; ++i) {
      const row = [];

      grid.push(row);

      for (let j = 0; j < cols; ++j) {
        const gene = this._initGene();

        gene.index = index++;
        row.push(gene);
        genes.push(gene);
      }
    }
  }

  _initGene() {
    const gene = this.create
      .custom('gene-item', GeneItem)
      .addTo(this);

    gene.onClick.add(this._onGeneClicked, this);

    return gene;
  }

  _onGeneClicked(gene) {
    this.onGeneClicked.post(gene);
  }
}
