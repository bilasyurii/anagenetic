import UIElement from '../../core/ui-element';
import ButtonsLine from './buttons-line';
import GenomesList from './genomes-list';
import GenomePanel from './genome-panel';

export default class GenomeLibrary extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._buttonsLine = null;
    this._genomesList = null;
    this._genomePanel = null;

    this._init();
  }

  _init() {
    this._initButtonsLine();
    this._initGenomesList();
    this._initGenomePanel();
    this._setupEvents();
  }

  _initButtonsLine() {
    this._buttonsLine = this.create
      .custom('buttons-line', ButtonsLine)
      .injectTo(this, 'buttons-line');
  }

  _initGenomesList() {
    this._genomesList = this.create
      .custom('genomes-list', GenomesList)
      .injectTo(this, 'genomes-list');
  }

  _initGenomePanel() {
    this._genomePanel = this.create
      .custom('genome-panel', GenomePanel)
      .injectTo(this, 'genome-panel');
  }

  _setupEvents() {
    const list = this._genomesList;
    const panel = this._genomePanel;

    list.onGenomeCardSelected.add((card) => {
      panel
        .setGenome(card.getGenome())
        .show();
    });

    panel.onClose.add(() => {
      list.deselect();
      panel.close();
    });
  }
}
