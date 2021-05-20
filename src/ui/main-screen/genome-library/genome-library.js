import UIElement from '../../core/ui-element';
import ButtonsLine from './buttons-line';
import GenomesList from './genomes-list';
import GenomePanel from './genome-panel';
import Observable from '../../../anvas/events/observable';

export default class GenomeLibrary extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onNewGenome = new Observable();
    this.onEditGenome = new Observable();

    this._buttonsLine = null;
    this._genomesList = null;
    this._genomePanel = null;

    this._init();
  }

  addGenome(genome) {
    this._genomesList.addGenome(genome);

    return this;
  }

  update() {
    this._genomesList.updateSelected();
    this._genomePanel.update();

    return this;
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
    const buttons = this._buttonsLine;

    list.onGenomeCardSelected.add((card) => {
      panel
        .setGenome(card.getGenome())
        .show();
    });

    panel.onClose.add(() => {
      list.deselect();
      panel.close();
    });

    panel.onDelete.add(() => {
      list.deleteSelected();
      panel.close();
    });

    panel.onEdit.add((genome) => this.onEditGenome.post(genome));

    buttons.onClearLibrary.add(() => {
      list.clear();
      panel.close();
    });

    buttons.onNewGenome.add(() => this.onNewGenome.post());
  }
}
