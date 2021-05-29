import Observable from '../../../anvas/events/observable';
import hashGenome from '../../../utils/hash-genome';
import UIElement from '../../core/ui-element';
import GenomeViewer from '../../genome/genome-viewer';

export default class CellPanelContent extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onClose = new Observable();

    this._genomeViewer = null;
    this._cellName = null;
    this._cell = null;
    this._genome = null;
    this._cellInfoWrapper = null;
    this._cellInfos = {};

    this._init();
  }

  setCell(cell) {
    this._cell = cell;
    this._genome = cell.genome;

    this._updateContent();

    return this;
  }

  updateInfo() {
    const cell = this._cell;

    const chemicals = cell.chemicals;
    const cellInfos = this._cellInfos;

    cellInfos['Energy'].valueNode.setText(cell.energy.toFixed(2));
    cellInfos['Energy capacity'].valueNode.setText(cell.energyCapacity);
    cellInfos['TTL'].valueNode.setText(cell.ttl);
    cellInfos['Mass'].valueNode.setText(cell.mass);
    cellInfos['Radius'].valueNode.setText(cell.radius);
    cellInfos['Armor'].valueNode.setText(cell.armor);
    cellInfos['Damage'].valueNode.setText(cell.damage);
    cellInfos['Speed'].valueNode.setText(cell.speed);
    cellInfos['Descendants'].valueNode.setText(cell.descendants);
    cellInfos['Generation'].valueNode.setText(cell.generation);
    cellInfos['Billanium'].valueNode.setText(chemicals.getAmount('billanium'));
    cellInfos['Chubium'].valueNode.setText(chemicals.getAmount('chubium'));
    cellInfos['Dion'].valueNode.setText(chemicals.getAmount('dion'));
    cellInfos['Hillagen'].valueNode.setText(chemicals.getAmount('hillagen'));
  }

  _init() {
    this._initHeader();
    this._initCellInfos();
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

  _initCellInfos() {
    this._cellInfoWrapper = this.create
      .template('cell-info-wrapper')
      .injectTo(this, 'cell-info');

    this._initCellInfo('Energy');
    this._initCellInfo('Energy capacity');
    this._initCellInfo('TTL');
    this._initCellInfo('Mass');
    this._initCellInfo('Radius');
    this._initCellInfo('Armor');
    this._initCellInfo('Damage');
    this._initCellInfo('Speed');
    this._initCellInfo('Descendants');
    this._initCellInfo('Generation');
    this._initCellInfo('Billanium');
    this._initCellInfo('Chubium');
    this._initCellInfo('Dion');
    this._initCellInfo('Hillagen');
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
      .setText('Save to Library')
      .setClick(() => console.log('Save to Library'))
      .addTo(buttons);

    this.create
      .button()
      .setText('Export to File')
      .setClick(() => console.log('Export to File'))
      .addTo(buttons);
  }

  _initCellInfo(key, value = 0) {
    const valueNode = this.create.text(value);
    const info = this._cellInfos[key] = this.create
      .template('cell-info-item')
      .addTo(this._cellInfoWrapper)
      .inject(this.create.text(key), 'key')
      .inject(valueNode, 'value');

    info.valueNode = valueNode;
  }

  _updateContent() {
    this._updateName();
    this._updateGenome();
    this.updateInfo();
  }

  _updateName() {
    const genome = this._genome;
    const genomeHash = hashGenome(genome);

    this._cellName.setText(genomeHash);
  }

  _updateGenome() {
    this._genomeViewer.setFromGenome(this._genome);
  }
}
