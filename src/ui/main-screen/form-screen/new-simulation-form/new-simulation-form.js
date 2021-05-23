import $ from 'jquery';
import SimulationGenomePicker from './simulation-genome-picker';
import UIElement from '../../../core/ui-element';
import Observable from '../../../../anvas/events/observable';
import ElementRegistry from '../../../../core/chemicals/element-registry';
import StringUtils from '../../../../utils/string-utils';

export default class NewSimulationForm extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onLaunch = new Observable();
    this.onCancel = new Observable();
    this.onImport = new Observable();
    this.onSelectGenome = new Observable();

    this._inputContainer$ = null;
    this._worldWidthInput = null;
    this._worldHeightInput = null;
    this._mutationStrategyInput = null;
    this._cellsAmountInput = null;
    this._cellStartingEnergyInput = null;
    this._divisionEnergyInput = null;
    this._spawnAdditionalCellsInput = null;
    this._randomSeedInput = null;
    this._cellContentsInputs = null;
    this._worldChemicalsInputs = null;
    this._simulationGenomePicker = null;
    this._buttons = null;

    this._init();
  }

  onGenomeSelected(genome) {
    this._simulationGenomePicker.addGenome(genome);

    return this;
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
    this._randomSeedInput.setValue(~~(Math.random() * 2147483648));
    this._resetChemicalsInputs();

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
    this._initRandomSeedCellsInput();
    this._initCellContentsInputs();
    this._initWorldChemicalsInputs();
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

  _initRandomSeedCellsInput() {
    this._randomSeedInput = this._initFormInput(
      'Random seed:',
      this.create.numberInput()
    );
  }

  _initSimulationGenomePicker() {
    this._simulationGenomePicker = this.create
      .custom('simulation-genome-picker', SimulationGenomePicker)
      .injectTo(this, 'genomes');
  }

  _initCellContentsInputs() {
    this._initFormItemsHeader('Cells starting contents')
    this._cellContentsInputs = this._initChemicalsInputs();
  }

  _initWorldChemicalsInputs() {
    this._initFormItemsHeader('World\'s starting chemicals')
    this._worldChemicalsInputs = this._initChemicalsInputs();
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

    picker.onAdd.add(() => this.onSelectGenome.post());
  }

  _initFormInput(name, input) {
    const formItem = this.create
      .formItem()
      .setName(name)
      .setInput(input);

    this._inputContainer$.append(formItem.dom);

    return formItem;
  }

  _initFormItemsHeader(text) {
    this.create
      .template('form-items-header')
      .inject(this.create.text(text))
      .dom$.appendTo(this._inputContainer$);
  }

  _initChemicalsInputs() {
    const create = this.create;
    const inputs = {};

    ElementRegistry.forEach((element) => {
      const name = element.name;

      inputs[name] = this._initFormInput(
        StringUtils.capitalize(name),
        create.numberInput()
      );
    });

    return inputs;
  }

  _launch() {
    const config = {
      worldWidth: parseInt(this._worldWidthInput.getValue()),
      worldHeight: parseInt(this._worldHeightInput.getValue()),
      mutationStrategy: this._mutationStrategyInput.getValue(),
      startingCellsAmount: parseInt(this._cellsAmountInput.getValue()),
      cellsStartingEnergy: parseInt(this._cellStartingEnergyInput.getValue()),
      energyToDivide: parseInt(this._divisionEnergyInput.getValue()),
      spawnAdditionalCells: this._spawnAdditionalCellsInput.getValue() === 'true',
      randomSeed: parseInt(this._randomSeedInput.getValue()),
      genomes: this._simulationGenomePicker.getGenomes(),
      cellChemicals: this._getChemicals(this._cellContentsInputs),
      worldChemicals: this._getChemicals(this._worldChemicalsInputs),
    };

    this.onLaunch.post(config);
  }

  _importSimulation() {
    // TODO
  }

  _resetChemicalsInputs() {
    const cells = this._cellContentsInputs;
    const world = this._worldChemicalsInputs;

    cells['billanium'].setValue(0);
    cells['hillagen'].setValue(20);
    cells['chubium'].setValue(0);
    cells['dion'].setValue(0);

    world['billanium'].setValue(200);
    world['hillagen'].setValue(200);
    world['chubium'].setValue(0);
    world['dion'].setValue(0);
  }

  _getChemicals(inputs) {
    const result = [];

    ElementRegistry.forEach(function(element) {
      const name = element.name;

      result.push({
        name,
        amount: parseInt(inputs[name].getValue()),
      });
    });

    return result;
  }
}
