import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';

export default class AnalysisPanelContent extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();

    this._analyticInfoWrapper = null;
    this._analyticInfos = {};

    this._init();
  }

  _init() {
    this._initHeader();
    this._initAnalyticInfos();
    this._initButtons();
  }

  _initHeader() {
    const headerTitle = this._cellName = this.create.text('Analysis');

    const header = this.create
      .template('side-panel-header')
      .inject(headerTitle)
      .injectTo(this, 'header');

    header.dom$.find('.close-button').click(() => this.onClose.post());
  }

  _initAnalyticInfos() {
    this._analyticInfoWrapper = this.create
      .template('analytic-info-wrapper')
      .injectTo(this, 'analytic-info');

    this._initAnalyticInfo('Analytic info 1');
    this._initAnalyticInfo('Analytic info 2');
    this._initAnalyticInfo('Analytic info 3');
    this._initAnalyticInfo('Analytic info 4');
    this._initAnalyticInfo('Analytic info 5');
    this._initAnalyticInfo('Analytic info 6');
    this._initAnalyticInfo('Analytic info 7');
  }

  _initButtons() {
    const buttons = this.create
      .template('panel-buttons')
      .injectTo(this, 'buttons');

    this.create
      .button()
      .setText('Best genome')
      .setClick(() => console.log('Best genome'))
      .addTo(buttons);
  }

  _initAnalyticInfo(key, value = 0) {
    const valueNode = this.create.text(value);
    const info = this._analyticInfos[key] = this.create
      .template('analytic-info-item')
      .addTo(this._analyticInfoWrapper)
      .inject(this.create.text(key), 'key')
      .inject(valueNode, 'value');

    info.valueNode = valueNode;
  }
}
