import Observable from '../../anvas/events/observable';
import UIElement from '../core/ui-element';
import EditGenomeForm from './form-screen/edit-genome-form';
import FormScreen from './form-screen/form-screen';
import NewGenomeForm from './form-screen/new-genome-form';
import NewSimulationForm from './form-screen/new-simulation-form/new-simulation-form';
import SelectGenomeScreen from './form-screen/new-simulation-form/select-genome-screen';
import GenomeLibrary from './genome-library/genome-library';

export default class MainScreenUI extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onSimulationStart = new Observable();

    this._genomeLibrary = null;
    this._formScreen = null;
    this._editGenomeForm = null;
    this._newGenomeForm = null;
    this._newSimulationForm = null;
    this._selectGenomeScreen = null;

    this._init();
  }

  _init() {
    this._initGenomeLibrary();
    this._initFormScreen();
    this._initEditGenomeForm();
    this._initNewGenomeForm();
    this._initNewSimulationForm();
    this._initSelectGenomeScreen();
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

  _initNewGenomeForm() {
    this._newGenomeForm = this.create
      .custom('edit-genome-form', NewGenomeForm);
  }

  _initNewSimulationForm() {
    this._newSimulationForm = this.create
      .custom('new-simulation-form', NewSimulationForm);
  }

  _initSelectGenomeScreen() {
    this._selectGenomeScreen = this.create
      .custom('select-genome-screen', SelectGenomeScreen);
  }

  _setupEvents() {
    const library = this._genomeLibrary;
    const forms = this._formScreen;
    const editGenomeForm = this._editGenomeForm;
    const newGenomeForm = this._newGenomeForm;
    const newSimulationForm = this._newSimulationForm;
    const selectGenomeScreen = this._selectGenomeScreen;

    const showForms = (form) => {
      forms
        .setContent(form)
        .injectTo(this);
    };

    const hideForms = () => {
      this.inject(library);
    }

    library.onEditGenome.add((genome) => showForms(editGenomeForm.setGenome(genome)));
    library.onNewGenome.add(() => showForms(newGenomeForm.reset()));
    library.onNewSimulation.add(() => showForms(newSimulationForm.reset()));

    editGenomeForm.onCancel.add(hideForms);
    editGenomeForm.onSave.add(() => {
      hideForms();
      library.update();
    });

    newGenomeForm.onCancel.add(hideForms);
    newGenomeForm.onSave.add(() => {
      hideForms();
      library.addGenome(newGenomeForm.getGenome());
    });

    selectGenomeScreen.onSelected.add((genome) => showForms(newSimulationForm.onGenomeSelected(genome)));

    newSimulationForm.onCancel.add(hideForms);
    newSimulationForm.onSelectGenome.add(() => {
      if (selectGenomeScreen.areGenesAvailable() === true) {
        selectGenomeScreen.injectTo(this);
      }
    });
    newSimulationForm.onLaunch.add(() => {
      this.onSimulationStart.post();
    });
  }
}
