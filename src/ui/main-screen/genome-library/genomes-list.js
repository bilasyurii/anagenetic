import Observable from '../../../anvas/events/observable';
import ArrayUtils from '../../../anvas/utils/array-utils';
import UIElement from '../../core/ui-element';
import GenomeCard from './genome-card';

export default class GenomesList extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onGenomeCardSelected = new Observable();

    this._cards = [];
    this._buttonText = 'View';
    this._selectedGenomeCard = null;
    this._genomeLibrary = null;
    this._importExport = null;
    this._message = null;

    this._init();
  }

  get dependencies() {
    return ['genomeLibrary', 'importExport'];
  }

  set genomeLibrary(genomeLibrary) {
    this._genomeLibrary = genomeLibrary;
    genomeLibrary.onChanges.add(this._onGenomeLibraryChanged, this);
    this._onGenomeLibraryChanged();
  }

  set importExport(importExport) {
    this._importExport = importExport;
  }

  setButtonText(text) {
    this._buttonText = text;

    ArrayUtils.forEach(this._cards, function(card) {
      card.setButtonText(text);
    });

    return this;
  }

  exportLibrary() {
    this._importExport.exportLibrary(this._genomeLibrary.genomes);

    return this;
  }

  deselect() {
    const selectedCard = this._selectedGenomeCard;

    if (selectedCard !== null) {
      selectedCard.deselect();
      this._selectedGenomeCard = null;
    }

    return this;
  }

  deleteSelected() {
    const card = this._selectedGenomeCard;
    const genome = card.getGenome();

    this._selectedGenomeCard = null;

    this._genomeLibrary.removeGenome(genome);

    return this;
  }

  clear() {
    this._selectedGenomeCard = null;
    this._genomeLibrary.removeAll();

    return this;
  }

  updateSelected() {
    this._selectedGenomeCard.update();

    return this;
  }

  addGenome(genome) {
    this._genomeLibrary.addGenome(genome);

    return this;
  }

  addGenomes(genomes) {
    this._genomeLibrary.addGenomes(genomes);

    return this;
  }

  _init() {
    this._initMessage();
  }

  _initMessage() {
    this._message = this.create
      .template('no-genomes-message')
      .addTo(this);
  }

  _onGenomeLibraryChanged() {
    const genomes = this._genomeLibrary.genomes;
    const count = genomes.length;

    this.dom$.children().remove();

    if (count === 0) {
      this._message.addTo(this);

      return;
    } else {
      this._message.remove();
    }

    const create = this.create;
    const cards = this._cards = [];
    const buttonText = this._buttonText;


    for (let i = 0; i < count; ++i) {
      const genomeCard = create
        .custom('genome-card', GenomeCard)
        .setButtonText(buttonText)
        .setGenome(genomes[i])
        .addTo(this);

      cards.push(genomeCard);
      genomeCard.onView.add(this._viewGenomeCard, this);
    }
  }

  _viewGenomeCard(genomeCard) {
    const selectedCard = this._selectedGenomeCard;

    if (selectedCard === genomeCard) {
      return;
    } else if (selectedCard !== null) {
      selectedCard.deselect();
    }

    this._selectedGenomeCard = genomeCard;

    genomeCard.select();
    this.onGenomeCardSelected.post(genomeCard);
  }
}
