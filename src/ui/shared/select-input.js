import Observable from '../../anvas/events/observable';
import UIElement from '../core/ui-element';

export default class SelectInput extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onChanges = new Observable();

    this._setupSelectEvents();
  }

  setValue(value) {
    this.dom$.val(value);

    return this;
  }

  getValue() {
    return this.dom$.val();
  }

  setOptions(options) {
    const count = options.length;
    const dom$ = this.dom$;

    dom$.children().remove();

    for (let i = 0; i < count; ++i) {
      dom$.append(this._createOption(options[i]));
    }

    return this;
  }

  _setupSelectEvents() {
    this.dom$.change(() => this.onChanges.post());
  }

  _createOption(config) {
    const option = this.create.tag('option');

    option.html(config.text);
    option.dom$.attr('value', config.value);

    return option.dom;
  }
}
