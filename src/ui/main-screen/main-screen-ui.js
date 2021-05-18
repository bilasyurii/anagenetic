import UIElement from '../core/ui-element';
import Observable from '../../anvas/events/observable';
import ButtonsLine from './buttons-line';

export default class MainScreenUI extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._buttonsList = null;

    this._init();
  }

  _init() {
    this._initButtonsList();
    this._setupEvents();
  }

  _initButtonsList() {
    this._buttonsList = this.create
      .custom('buttons-line', ButtonsLine)
      .addTo(this);
  }

  _setupEvents() {
  }
}
