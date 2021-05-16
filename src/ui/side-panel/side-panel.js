import Observable from '../../anvas/events/observable';
import UIElement from '../core/ui-element';

export default class SidePanel extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();
    this.onShow = new Observable();
  }

  close() {
    this.onClose.post(this);
    this.dom$.addClass('panel-hidden');
  }

  show() {
    this.onShow.post(this);
    this.dom$.removeClass('panel-hidden');
  }
}
