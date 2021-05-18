import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';

export default class MenuPanelContent extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();
    this.onAnalysisOpen = new Observable();

    this._init();
  }

  _init() {
    this._initHeader();
    this._initButtons();
  }

  _initHeader() {
    const headerTitle = this._cellName = this.create.text('Menu');

    const header = this.create
      .template('side-panel-header')
      .inject(headerTitle)
      .injectTo(this, 'header');

    header.dom$.find('.close-button').click(() => this.onClose.post());
  }

  _initButtons() {
    const buttons = this.create
      .template('panel-buttons')
      .injectTo(this, 'buttons');

    this.create
      .button()
      .setText('Analysis')
      .setClick(() => this.onAnalysisOpen.post())
      .addTo(buttons);

    this.create
      .button()
      .setText('Export')
      .setClick(() => console.log('Export'))
      .addTo(buttons);
  }
}
