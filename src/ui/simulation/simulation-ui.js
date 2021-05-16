import Genome from '../../core/genome/genome';
import hashGenome from '../../utils/hash-genome';
import GenomeViewer from '../genome/genome-viewer';
import SidePanel from '../side-panel/side-panel';

export default class SimulationUI {
  constructor(factory, parent) {
    this.create = factory;
    this.parent = parent;

    this._init();
  }

  add(child) {
    this.parent.add(child);

    return this;
  }

  _init() {
    const sidePanel = this.create
      .custom('side-panel', SidePanel)
      .addTo(this);

    const cellPanelContent = this.create
      .template('cell-side-panel-content')
      .injectTo(sidePanel);

    const genome = Genome.random();
    const genomeHash = hashGenome(genome);

    const cellName = this.create.text().setText(genomeHash);

    const header = this.create
      .template('side-panel-header')
      .inject(cellName)
      .injectTo(cellPanelContent, 'header');

    sidePanel.onClose.add(() => console.log('closed'));
    header.dom$.find('.close-button').click(() => sidePanel.close());

    this.create
      .custom('genome-viewer', GenomeViewer)
      .injectTo(cellPanelContent, 'genome')
      .setFromGenome(genome);

    const cellInfoWrapper = this.create
      .template('cell-info-wrapper')
      .injectTo(cellPanelContent, 'cell-info');

    const cellInfos = {};

    const createCellInfo = (key, value = 0) => {
      cellInfos[key] = this.create
        .template('cell-info-item')
        .addTo(cellInfoWrapper)
        .inject(this.create.text(key), 'key')
        .inject(this.create.text(value), 'value');
    };

    createCellInfo('Energy');
    createCellInfo('Energy capacity');
    createCellInfo('TTL');
    createCellInfo('Radius');
    createCellInfo('Armor');
    createCellInfo('Damage');
    createCellInfo('Ancestors');
    createCellInfo('Generation');
    createCellInfo('Billanium');
    createCellInfo('Chubium');
    createCellInfo('Dion');
    createCellInfo('Hillagen');

    const buttons = this.create
      .template('cell-panel-buttons')
      .injectTo(cellPanelContent, 'buttons');

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

    setTimeout(() => {
      sidePanel.show()
    }, 500);
  }
}