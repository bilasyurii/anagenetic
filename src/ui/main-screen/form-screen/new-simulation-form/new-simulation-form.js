import $ from 'jquery';
import SimulationGenomePicker from './simulation-genome-picker';
import Genome from '../../../../core/genome/genome';
import UIElement from '../../../core/ui-element';
import Observable from '../../../../anvas/events/observable';

export default class NewSimulationForm extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onLaunch = new Observable();
    this.onCancel = new Observable();
    this.onImport = new Observable();

    this._inputContainer$ = null;
    this._worldWidthInput = null;
    this._worldHeightInput = null;
    this._mutationStrategyInput = null;
    this._cellsAmountInput = null;
    this._cellStartingEnergyInput = null;
    this._divisionEnergyInput = null;
    this._spawnAdditionalCellsInput = null;
    this._simulationGenomePicker = null;
    this._buttons = null;

    this._init();
  }

  getHeaderText() {
    return 'New simulation';
  }

  reset() {
    this._worldWidthInput.setValue(1000);
    this._worldHeightInput.setValue(1000);
    this._mutationStrategyInput.setValue('pick');
    this._cellsAmountInput.setValue(20);
    this._cellStartingEnergyInput.setValue(20);
    this._divisionEnergyInput.setValue(10);
    this._spawnAdditionalCellsInput.setValue('false');

    return this;
  }

  _init() {
    this._setupInputContainer();
    this._initWorldWidthInput();
    this._initWorldHeightInput();
    this._initMutationStrategyInput();
    this._initCellsAmountInput();
    this._initCellsStartingEnergyInput();
    this._initDivisionEnergyInput();
    this._initSpawnAdditionalCellsInput();
    this._initSimulationGenomePicker();
    this._initButtons();
    this._setupEvents();
  }

  _setupInputContainer() {
    this._inputContainer$ = $(this.dom$.find('.inputs')[0]);
  }

  _initWorldWidthInput() {
    this._worldWidthInput = this._initFormInput(
      'World width: ',
      this.create.numberInput()
    );
  }

  _initWorldHeightInput() {
    this._worldHeightInput = this._initFormInput(
      'World height: ',
      this.create.numberInput()
    );
  }

  _initMutationStrategyInput() {
    this._mutationStrategyInput = this._initFormInput(
      'Mutation strategy: ',
      this.create.selectInput().setOptions([
        {
          value: 'pick',
          text: 'Pick Mutation Strategy',
        },
        {
          value: 'force',
          text: 'Force Mutation Strategy',
        },
      ])
    );
  }

  _initEnergyAmountInput() {
    this._energyAmountInput = this._initFormInput(
      'World energy amount:',
      this.create.numberInput()
    );
  }

  _initCellsAmountInput() {
    this._cellsAmountInput = this._initFormInput(
      'Starting cells amount:',
      this.create.numberInput()
    );
  }

  _initCellsStartingEnergyInput() {
    this._cellStartingEnergyInput = this._initFormInput(
      'Cells starting energy:',
      this.create.numberInput()
    );
  }

  _initDivisionEnergyInput() {
    this._divisionEnergyInput = this._initFormInput(
      'Energy to divide:',
      this.create.numberInput()
    );
  }

  _initSpawnAdditionalCellsInput() {
    this._spawnAdditionalCellsInput = this._initFormInput(
      'Spawn additional cells:',
      this.create.selectInput().setOptions([
        {
          value: 'true',
          text: 'true',
        },
        {
          value: 'false',
          text: 'false',
        },
      ])
    );
  }

  _initSimulationGenomePicker() {
    this._simulationGenomePicker = this.create
      .custom('simulation-genome-picker', SimulationGenomePicker)
      .injectTo(this, 'genomes');
  }

  _initButtons() {
    const buttons = this._buttons = this.create
      .template('form-buttons')
      .injectTo(this, 'buttons');

    this.create
      .button()
      .setText('Launch')
      .setClick(() => this._launch())
      .addTo(buttons);

    this.create
      .button()
      .setText('Cancel')
      .setClick(() => this.onCancel.post())
      .addTo(buttons);

    this.create
      .button()
      .setText('Import simulation')
      .setClick(() => this._importSimulation())
      .addTo(buttons);
  }

  _setupEvents() {
    const picker = this._simulationGenomePicker;

    picker.onAdd.add(() => picker.addGenome(Genome.random()));
  }

  _initFormInput(name, input) {
    const formItem = this.create
      .formItem()
      .setName(name)
      .setInput(input);

    this._inputContainer$.append(formItem.dom);

    return formItem;
  }

  _launch() {
    // this._genome.name = this._nameInput.getValue();
    // this._genome.createdDate = Date.now();
    this.onLaunch.post();
  }

  _importSimulation() {
    // TODO
  }
}
