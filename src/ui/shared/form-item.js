import UIElement from '../core/ui-element';

export default class FormItem extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._name = null;
    this._input = null;

    this._init();
  }

  setInput(input) {
    this._input = input;
    this.inject(input, 'input');

    return this;
  }

  setName(text) {
    this._name.setText(text);

    return this;
  }

  getValue() {
    return this._input.getValue();
  }

  setValue(value) {
    return this._input.setValue(value);
  }

  get isDisabled() {
    return this._input.isDisabled;
  }

  disable() {
    this._input.disable();

    return this;
  }

  enable() {
    this._input.enable();

    return this;
  }

  _init() {
    this._name = this.create
      .text()
      .injectTo(this, 'name');
  }
}
