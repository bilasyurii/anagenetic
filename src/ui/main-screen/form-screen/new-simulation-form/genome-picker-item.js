import Observable from '../../../../anvas/events/observable';
import UIElement from '../../../core/ui-element';

export default class GenomePickerItem extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClick = new Observable();

    this._name = null;
    this._genome = null;
    this._isSelected = false;

    this._init();
  }

  isSelected() {
    return this._isSelected;
  }

  select() {
    if (this._isSelected === true) {
      return this;
    }

    this._isSelected = true;
    this.addClass('selected');

    return this;
  }

  deselect() {
    if (this._isSelected === false) {
      return this;
    }

    this._isSelected = false;
    this.removeClass('selected');

    return this;
  }

  getGenome() {
    return this._genome;
  }

  setGenome(genome) {
    const name = genome.name || 'Unnamed';

    this._genome = genome;
    this._name.setText(name);

    return this;
  }

  _init() {
    this._initName();
    this._setupEvents();
  }

  _initName() {
    this._name = this.create
      .text()
      .injectTo(this);
  }

  _setupEvents() {
    this.dom$.click(() => this.onClick.post(this));
  }
}
