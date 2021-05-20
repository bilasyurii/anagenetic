import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';
import GenomeCard from './genome-card';

export default class GenomesList extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onGenomeCardSelected = new Observable();

    this._selectedGenomeCard = null;
    this._genomeLibrary = null;
  }

  get dependencies() {
    return ['genomeLibrary'];
  }

  set genomeLibrary(genomeLibrary) {
    this._genomeLibrary = genomeLibrary;
    genomeLibrary.onChanges.add(this._onGenomeLibraryChanged, this);
    this._onGenomeLibraryChanged();
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

  onInjected() {
    // TODO init
  }

  _onGenomeLibraryChanged() {
    const create = this.create;
    const genomes = this._genomeLibrary.genomes;
    const count = genomes.length;

    this.dom$.children().remove();

    for (let i = 0; i < count; ++i) {
      const genomeCard = create
        .custom('genome-card', GenomeCard)
        .setGenome(genomes[i])
        .addTo(this);

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
