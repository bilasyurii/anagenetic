import UIElement from '../core/ui-element';

export default class Button extends UIElement {
  setClick(callback) {
    this.dom.onclick = callback;

    return this;
  }

  setText(text) {
    this.dom.innerHTML = text;

    return this;
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
