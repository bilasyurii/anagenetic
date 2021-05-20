import UIElement from '../core/ui-element';
import FormScreen from './form-screen/form-screen';
import GenomeLibrary from './genome-library/genome-library';

export default class MainScreenUI extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._genomeLibrary = null;
    this._formScreen = null;

    this._init();
  }

  _init() {
    this._initGenomeLibrary();
    this._initFormScreen();
    this._setupEvents();
  }

  _initGenomeLibrary() {
    this._genomeLibrary = this.create
      .custom('genome-library', GenomeLibrary)
      .injectTo(this);
  }

  _initFormScreen() {
    this._formScreen = this.create
      .custom('form-screen', FormScreen);
  }

  _setupEvents() {
    const library = this._genomeLibrary;
    const forms = this._formScreen;

    const showForms = () => {
      forms.injectTo(this);
    };

    library.onEditGenome.add((genome) => {
      showForms();
      forms.editGenome(genome);
    });
  }
}
