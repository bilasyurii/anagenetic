import Observable from '../../../anvas/events/observable';
import hashGenome from '../../../utils/hash-genome';
import UIElement from '../../core/ui-element';
import GenomeViewer from '../../genome/genome-viewer';

export default class GenomePanel extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();
    this.onShow = new Observable();
    this.onDelete = new Observable();
    this.onEdit = new Observable();

    this._importExport = null;
    this._genomeViewer = null;
    this._genomeCode = null;
    this._genome = null;
    this._isOpened = false;

    this._init();
  }

  get dependencies() {
    return ['importExport'];
  }

  set importExport(service) {
    this._importExport = service;
  }

  setGenome(genome) {
    this._genome = genome;

    this.update();

    return this;
  }

  update() {
    const genome = this._genome;
    const hash = hashGenome(genome);

    this._genomeCode.setText(hash);
    this._genomeViewer.setFromGenome(genome);

    return this;
  }

  isOpened() {
    return this._isOpened;
  }

  close(silent) {
    if (this._isOpened === false) {
      return this;
    }

    this._isOpened = false;

    this.dom$.addClass('genome-panel-hidden');

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

    this.dom$.removeClass('genome-panel-hidden');

    if (silent !== true) {
      this.onShow.post(this);
    }

    return this;
  }

  _init() {
    this._initHeader();
    this._initGenomeViewer();
    this._initButtons();
  }

  _initHeader() {
    const genomeCode = this._genomeCode = this.create.text();

    const header = this.create
      .template('side-panel-header')
      .inject(genomeCode)
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
      .setClick(() => this.onEdit.post(this._genome))
      .addTo(buttons);

    this.create
      .button()
      .setText('Delete')
      .setClick(() => this.onDelete.post())
      .addTo(buttons);

    this.create
      .button()
      .setText('Export Genome')
      .setClick(() => this._export())
      .addTo(buttons);
  }

  _export() {
    this._importExport.exportGenome(this._genome);
  }
}
