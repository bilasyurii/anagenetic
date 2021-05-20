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
}
