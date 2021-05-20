import Observable from '../../../anvas/events/observable';
import Genome from '../../../core/genome/genome';
import UIElement from '../../core/ui-element';
import GenomeEditor from '../../genome/genome-editor';

export default class NewGenomeForm extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onSave = new Observable();
    this.onCancel = new Observable();

    this._genome = null;
    this._buttons = null;
    this._nameInput = null;
    this._genomeEditor = null;

    this._init();
  }

  getHeaderText() {
    return 'New genome';
  }

  reset() {
    const genome = Genome.zero();

    this._genome = genome;
    this._genomeEditor.setFromGenome(genome);

    return this;
  }

  getGenome() {
    return this._genome;
  }

  _init() {
    this._initNameInput();
    this._initGenomeViewer();
    this._initButtons();
  }

  _initNameInput() {
    this._nameInput = this.create
      .formItem()
      .setName('Name:')
      .setInput(this.create.textInput())
      .injectTo(this, 'genome-name');
  }

  _initGenomeViewer() {
    this._genomeEditor = this.create
      .custom('genome-editor', GenomeEditor)
      .injectTo(this, 'genome-editor');
  }

  _initButtons() {
    const buttons = this._buttons = this.create
      .template('form-buttons')
      .injectTo(this, 'buttons');

    this.create
      .button()
      .setText('Save')
      .setClick(() => this._save())
      .addTo(buttons);

    this.create
      .button()
      .setText('Cancel')
      .setClick(() => this.onCancel.post())
      .addTo(buttons);

    this.create
      .button()
      .setText('Randomize')
      .setClick(() => this._randomize())
      .addTo(buttons);
  }

  _save() {
    this._genome.name = this._nameInput.getValue();
    this._genome.createdDate = Date.now();
    this.onSave.post();
  }

  _randomize() {
    this._genomeEditor.randomize();
  }
}
