import UIElement from '../../core/ui-element';
import GenomeCard from './genome-card';

export default class GenomesList extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

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

  onInjected() {
    // TODO init
  }

  _onGenomeLibraryChanged() {
    const create = this.create;
    const genomes = this._genomeLibrary.genomes;
    const count = genomes.length;

    this.dom$.children().remove();

    for (let i = 0; i < count; ++i) {
      create
        .custom('genome-card', GenomeCard)
        .setGenome(genomes[i])
        .addTo(this);
    }
  }
}
