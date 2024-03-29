import UIElement from '../../core/ui-element';
import Observable from '../../../anvas/events/observable';
import hashGenome from '../../../utils/hash-genome';

export default class GenomeCard extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onView = new Observable();

    this._genome = null;
    this._genomeName = null;
    this._genomeCode = null;
    this._createdDate = null;
    this._button = null;

    this._init();
  }

  select() {
    this.dom$.addClass('selected');
    this._button.disable();

    return this;
  }

  deselect() {
    this.dom$.removeClass('selected');
    this._button.enable();

    return this;
  }

  getGenome() {
    return this._genome;
  }

  setButtonText(text) {
    this._button.setText(text);

    return this;
  }

  setGenome(genome) {
    this._genome = genome;

    this.update();

    return this;
  }

  update() {
    const genome = this._genome;
    const genomeHash = hashGenome(genome);
    const genomeName = genome.name || 'Unnamed';

    let createdDate = genome.createdDate;

    if (createdDate === null) {
      createdDate = new Date(); 
    } else {
      createdDate = new Date(createdDate);
    }

    const genomeDate = createdDate.toLocaleDateString();

    this._genomeCode.setText(genomeHash)
    this._genomeName.setText(genomeName);
    this._createdDate.setText(genomeDate);

    return this;
  }

  _init() {
    this._setupNodes();
    this._initButton();
  }

  _setupNodes() {
    this._genomeName = this.create
      .text()
      .injectTo(this, 'genome-name');

    this._genomeCode = this.create
      .text()
      .injectTo(this, 'genome-code');

    this._createdDate = this.create
      .text()
      .injectTo(this, 'created-date');
  }

  _initButton() {
    this._button = this.create
      .button()
      .setText('View')
      .setClick(() => this.onView.post(this))
      .injectTo(this, 'button');
  }
}
