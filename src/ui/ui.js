import '../../node_modules/milligram/dist/milligram.min.css';
import '../../css/main.scss';
import '../../css/font-awesome.css';
import TemplateMaster from './template-master';
import UIFactory from './ui-factory';
import UIElement from './core/ui-element';
import $ from 'jquery';
import SidePanel from './side-panel/side-panel';
import Genome from '../core/genome/genome';
import GenomeViewer from './genome/genome-viewer';
import hashGenome from '../utils/hash-genome';

export default class UI extends UIElement {
  constructor() {
    TemplateMaster.init();

    super(new UIFactory(), $('#uiRoot')[0]);

    this._init();
  }

  _init() {
    // const button = this.create
    //   .button()
    //   .setText('Test')
    //   .setClick(() => console.log('test'))

    const sidePanel = this.create
      .custom('cell-side-panel', SidePanel)
      .addTo(this);

    const genome = Genome.random();
    const genomeHash = hashGenome(genome);

    const cellName = this.create.text().setText(genomeHash);

    const header = this.create
      .template('side-panel-header')
      .inject(cellName)
      .injectTo(sidePanel, 'header');

    sidePanel.onClose.add(() => console.log('closed'));
    header.dom$.find('.close-button').click(() => sidePanel.close());

    const genomeViewer = this.create
      .custom('genome-viewer', GenomeViewer)
      .injectTo(sidePanel, 'genome')
      .setFromGenome(genome);

    const cellInfoWrapper = this.create
      .template('cell-info-wrapper')
      .injectTo(sidePanel, 'cell-info');

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

    setTimeout(() => {
      sidePanel.show()
    }, 500);
  }
}
