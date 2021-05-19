import UIElement from '../../core/ui-element';

export default class GenomePanel extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._genomes = [];

    this._init();
  }

  _init() {
  }
}
