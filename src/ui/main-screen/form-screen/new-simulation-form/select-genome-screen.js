import Observable from '../../../../anvas/events/observable';
import UIElement from '../../../core/ui-element';
import GenomesList from '../../genome-library/genomes-list';

export default class SelectGenomeScreen extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onSelected = new Observable();

    this._genomesList = null;

    this._init();
  }

  _init() {
    this._initGenomesList();
    this._setupEvents();
  }

  _initGenomesList() {
    this._genomesList = this.create
      .custom('genomes-list', GenomesList)
      .setButtonText('Select')
      .injectTo(this, 'genomes-list');
  }

  _setupEvents() {
    const list = this._genomesList;

    list.onGenomeCardSelected.add((card) => {
      list.deselect();
      this.onSelected.post(card.getGenome());
    });
  }
}
