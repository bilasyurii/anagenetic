import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';

export default class SimulationSidePanel extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();
    this.onShow = new Observable();

    this._isOpened = false;
  }

  isOpened() {
    return this._isOpened;
  }

  close(silent) {
    if (this._isOpened === false) {
      return this;
    }

    this._isOpened = false;

    this.dom$.addClass('panel-hidden');

    if (silent !== true) {
      this.onClose.post(this);
    }

    return this;
  }

  show(silent) {
    if (this._isOpened === true) {
      return this;
    }

    this._isOpened = true;

    this.dom$.removeClass('panel-hidden');

    if (silent !== true) {
      this.onShow.post(this);
    }

    return this;
  }
}
