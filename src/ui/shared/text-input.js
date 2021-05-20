import UIElement from '../core/ui-element';

export default class TextInput extends UIElement {
  setValue(value) {
    this.dom$.val(value);

    return this;
  }

  getValue() {
    return this.dom$.val();
  }
}
