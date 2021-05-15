import UIElement from '../core/ui-element';

export default class TextNode extends UIElement {
  setText(text) {
    this.dom.nodeValue = text;

    return this;
  }
}
