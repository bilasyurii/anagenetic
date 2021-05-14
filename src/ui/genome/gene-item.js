import Observable from '../../anvas/events/observable';
import UIElement from '../core/ui-element';

export default class GeneItem extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClick = new Observable();

    this.gene = null;

    this._setupEvents();
  }

  setGene(gene) {
    this.gene = gene;

    return this;
  }

  update() {
    this.dom$.html(this.gene.mnemonic + '<br>' + this.gene.value);
  }

  _setupEvents() {
    this.dom$.click(() => this.onClick.post(this));
  }
}
