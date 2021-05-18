import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';

export default class OpenPanelButton extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.isVisible = true;
    this.onOpenPanel = new Observable();

    this.dom$.click(() => this.onOpenPanel.post());
  }

  show() {
    if (this.isVisible === true) {
      return;
    }

    this.isVisible = true;
    this.dom$.removeClass('open-panel-button-hidden');
  }

  hide() {
    if (this.isVisible === false) {
      return;
    }

    this.isVisible = false;
    this.dom$.addClass('open-panel-button-hidden');
  }
}
