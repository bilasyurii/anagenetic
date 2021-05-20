import Genome from '../../core/genome/genome';
import UIElement from '../core/ui-element';
import EditGenomeForm from './form-screen/edit-genome/edit-genome-form';
import FormScreen from './form-screen/form-screen';
import GenomeLibrary from './genome-library/genome-library';

export default class MainScreenUI extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._genomeLibrary = null;
    this._formScreen = null;
    this._editGenomeForm = null;

    this._init();
  }

  _init() {
    this._initGenomeLibrary();
    this._initFormScreen();
    this._initEditGenomeForm();
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

  _initEditGenomeForm() {
    this._editGenomeForm = this.create
      .custom('edit-genome-form', EditGenomeForm);
  }

  _setupEvents() {
    const library = this._genomeLibrary;
    const forms = this._formScreen;
    const editGenomeForm = this._editGenomeForm;

    const showForms = (form) => {
      forms
        .setContent(form)
        .injectTo(this);
    };

    const hideForms = () => {
      this.inject(library);
    }

    library.onEditGenome.add((genome) => showForms(editGenomeForm.setGenome(genome)));

    editGenomeForm.onCancel.add(hideForms);
    editGenomeForm.onSave.add(() => {
      hideForms();
      library.update();
    });
  }
}
