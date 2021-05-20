import UIElement from '../core/ui-element';
import GeneItem from './gene-item';
import GenomeTable from './genome-table';

export default class GenomeViewer extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._descriptor = null;
    this._table = null;
    this._selected = null;
    this._genome = null;

    this._init();
  }

  setFromGenome(genome) {
    this._genome = genome;
    this._table.setFromGenome(genome);

    return this;
  }

  _init() {
    this._initGenomeTable();
    this._initDescriptor();
    this._setupEvents();
  }

  _initGenomeTable() {
    this._table = this.create
      .custom('genome-table', GenomeTable)
      .injectTo(this, 'table');
  }

  _initDescriptor() {
    this._descriptor = this.create
      .template('gene-descriptor')
      .injectTo(this, 'descriptor');
  }

  _setupEvents() {
    this._table.onGeneClicked.add(this._onGeneClicked, this);
  }

  _onGeneClicked(geneItem) {
    const table = this._table;

    table.setGenesState(GeneItem.State.Default);

    if (geneItem === this._selected) {
      this._selected = null;
      this._descriptor.html('');
      return false;
    } else {
      this._selected = geneItem;
      geneItem.setState(GeneItem.State.Selected);

      const gene = geneItem.getGene();
      const command = gene.command;

      this._descriptor.html(command.description);

      const argsCount = command.argsCount;
      const index = geneItem.index;
      const highlightedState = GeneItem.State.Highlighted1;

      for (let i = 0; i < argsCount; ++i) {
        const item = table.getByIndex(index + i + 1);

        if (item === undefined) {
          continue;
        }

        item.setState(highlightedState);
      }

      return true;
    }
  }
}
