import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';
import GenomeViewer from '../../genome/genome-viewer';

export default class GenomePanel extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();

    this._genomeViewer = null;
    this._cellName = null;
    this._genome = null;

    this._init();
  }

  setGenome(genome) {
    this._genome = genome;

    this._updateContent();

    return this;
  }

  _init() {
    this._initHeader();
    this._initGenomeViewer();
    this._initButtons();
  }

  _initHeader() {
    const cellName = this._cellName = this.create.text();

    const header = this.create
      .template('side-panel-header')
      .inject(cellName)
      .injectTo(this, 'header');

    header.dom$.find('.close-button').click(() => this.onClose.post());
  }

  _initGenomeViewer() {
    this._genomeViewer = this.create
      .custom('genome-viewer', GenomeViewer)
      .injectTo(this, 'genome');
  }

  _initButtons() {
    const buttons = this.create
      .template('panel-buttons')
      .injectTo(this, 'buttons');

    this.create
      .button()
      .setText('Edit')
      .setClick(() => console.log('Edit'))
      .addTo(buttons);

    this.create
      .button()
      .setText('Delete')
      .setClick(() => console.log('Delete'))
      .addTo(buttons);

    this.create
      .button()
      .setText('Export Genome')
      .setClick(() => console.log('Export Genome'))
      .addTo(buttons);
  }
}
