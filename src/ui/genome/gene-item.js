import UIElement from '../core/ui-element';

export default class GeneItem extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.gene = null;
  }

  setGene(gene) {
    this.gene = gene;

    return this;
  }

  update() {
    this.dom$.html(this.gene.mnemonic + '<br>' + this.gene.value);
  }
}
