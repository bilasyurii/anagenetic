import UIElement from '../core/ui-element';
import GeneItem from './gene-item';

export default class GenomeViewer extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._descriptor = null;
    this._table = null;
    this._selected = null;
  }

  setTable(table) {
    this._table = table;

    this.inject(table, 'table');
    this._setup();

    return this;
  }

  setDescriptor(descriptor) {
    this._descriptor = descriptor;

    this.inject(descriptor, 'descriptor');
    this._setup();

    return this;
  }

  _setup() {
    if (this._descriptor === null) {
      return;
    }

    const table = this._table;

    if (table === null) {
      return;
    }

    table.onGeneClicked.add(this._onGeneClicked, this);
  }

  _onGeneClicked(geneItem) {
    const table = this._table;

    table.setGenesState(GeneItem.State.Default);

    if (geneItem === this._selected) {
      this._selected = null;
      this._descriptor.html('');
    } else {
      this._selected = geneItem;
      geneItem.setState(GeneItem.State.Selected);

      const gene = geneItem.gene;
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
    }
  }
}
