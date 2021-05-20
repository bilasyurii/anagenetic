import UIElement from '../../core/ui-element';

export default class FormScreen extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._header = null;

    this._init();
  }

  setContent(element) {
    const title = element.getHeaderText();

    this._header.setText(title);
    element.injectTo(this, 'form-content');

    return this;
  }

  _init() {
    this._initHeader();
  }

  _initHeader() {
    this._header = this.create
      .text()
      .injectTo(this, 'form-header');
  }
}
