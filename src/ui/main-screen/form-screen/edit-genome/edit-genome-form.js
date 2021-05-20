import UIElement from '../../../core/ui-element';
import GenomeViewer from '../../../genome/genome-viewer';

export default class EditGenomeForm extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._genome = null;
    this._buttons = null;
    this._nameInput = null;
    this._genomeViewer = null;

    this._init();
  }

  getHeaderText() {
    return 'Edit genome';
  }

  setGenome(genome) {
    const name = genome.name || 'Unnamed';

    this._genome = genome;
    this._genomeViewer.setFromGenome(genome);
    this._nameInput.setValue(name);

    return this;
  }

  _init() {
    this._initNameInput();
    this._initGeneSelect();
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

  _initGeneSelect() {}

  _initGenomeViewer() {
    this._genomeViewer = this.create
      .custom('genome-viewer', GenomeViewer)
      .injectTo(this, 'genome-viewer');
  }

  _initButtons() {
    const buttons = this._buttons = this.create
      .template('form-buttons')
      .injectTo(this, 'buttons');

    this.create
      .button()
      .setText('Save')
      .setClick(() => console.log('Save'))
      .addTo(buttons);

    this.create
      .button()
      .setText('Cancel')
      .setClick(() => console.log('Cancel'))
      .addTo(buttons);
  }
}
