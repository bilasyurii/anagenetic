import UIElement from '../core/ui-element';

export default class TextInput extends UIElement {
  setValue(text) {
    this.dom$.val(text);

    return this;
  }

  getValue() {
    return this.dom$.val();
  }

  get isDisabled() {
    return this.dom$.prop('disabled');
  }

  disable() {
    this.dom$.prop('disabled', true);

    return this;
  }

  enable() {
    this.dom$.prop('disabled', false);

    return this;
  }
}
