import Observable from '../../anvas/events/observable';
import UIElement from '../core/ui-element';

export default class GeneItem extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClick = new Observable();

    this.index = 0;

    this._gene = null;
    this._state = GeneItem.State.Default;

    this._setupEvents();
  }

  getState() {
    return this._state;
  }

  setState(state) {
    this.dom$.removeClass(this._state);
    this.dom$.addClass(state);
    this._state = state;

    return this;
  }

  getGene() {
    return this._gene;
  }

  setGene(gene) {
    this._gene = gene;

    return this;
  }

  update() {
    this.dom$.html(this._gene.mnemonic + '<br>' + this._gene.value);
  }

  _setupEvents() {
    this.dom$.click(() => this.onClick.post(this));
  }
}

GeneItem.State = {
  Default: 'gene-default',
  Selected: 'gene-selected',
  Disabled: 'gene-disabled',
  Highlighted1: 'gene-highlighted-1',
  Highlighted2: 'gene-highlighted-2',
};
