import UIElement from '../core/ui-element';

export default class GenomeViewer extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._descriptor = null;
    this._table = null;
  }

  setTable(table) {
    this._table = table;

    this.inject(table, 'table');

    return this;
  }

  setDescriptor(descriptor) {
    this._descriptor = descriptor;

    this.inject(descriptor, 'descriptor');

    return this;
  }
}
