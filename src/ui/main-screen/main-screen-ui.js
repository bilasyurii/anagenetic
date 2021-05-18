import UIElement from '../core/ui-element';
import Observable from '../../anvas/events/observable';

export default class MainScreenUI extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._init();
  }

  _init() {
    this._setupEvents();
  }

  _setupEvents() {
  }
}
