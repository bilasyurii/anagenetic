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
    const button = this.create
      .button()
      .setText('Test')
      .setClick(() => console.log('test'))

    const genome = Genome.random();
    const genomeHash = hashGenome(genome);

    const cellName = this.create.text().setText(genomeHash);

    const header = this.create
      .template('side-panel-header')
      .inject(cellName);

    const sidePanel = this.create
      .custom('cell-side-panel', SidePanel)
      .addTo(this)
      .inject(header, 'header');

    sidePanel.onClose.add(() => console.log('closed'));

    header.dom$.find('.close-button').click(() => sidePanel.close());

    const genomeViewer = this.create
      .custom('genome-viewer', GenomeViewer)
      .injectTo(sidePanel, 'genome')
      .setFromGenome(genome);

    setTimeout(() => {
      sidePanel.show()
    }, 500);
  }
}
