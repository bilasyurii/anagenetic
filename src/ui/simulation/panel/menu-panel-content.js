import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';

export default class MenuPanelContent extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();
    this.onAnalysisOpen = new Observable();

    this._importExport = null;
    this._world = null;

    this._init();
  }

  get dependencies() {
    return ['importExport'];
  }

  set importExport(service) {
    this._importExport = service;
  }

  setWorld(world) {
    this._world = world;
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
      .setText('Export simulation')
      .setClick(() => this._exportSimulation())
      .addTo(buttons);
  }

  _exportSimulation() {
    this._importExport.exportWorld(this._world);
  }
}
