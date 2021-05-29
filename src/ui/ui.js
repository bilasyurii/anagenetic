import '../../node_modules/milligram/dist/milligram.min.css';
import '../../css/font-awesome.css';
import '../../css/main.scss';
import $ from 'jquery';
import TemplateMaster from './core/template-master';
import UIFactory from './core/ui-factory';
import UIElement from './core/ui-element';
import SimulationControls from './simulation/controls/simulation-controls';
import SimulationUI from './simulation/simulation-ui';
import Observable from '../anvas/events/observable';
import MainScreenUI from './main-screen/main-screen-ui';
import DependencyInjection from './core/dependency-injection';
import GenomeLibraryService from './services/genome-library-service';
import ImportExportService from './services/import-export-service';

export default class UI extends UIElement {
  constructor() {
    TemplateMaster.init();

    super(new UIFactory(new DependencyInjection()), $('#uiRoot')[0]);

    this.onPlay = new Observable();
    this.onPause = new Observable();
    this.onStop = new Observable();
    this.onSpeedChanged = new Observable();
    this.onZoomChanged = new Observable();
    this.onCellDeselected = new Observable();
    this.onSimulationStart = new Observable();

    this._header = null;
    this._simulationControls = null;
    this._simulationUI = null;
    this._mainScreenUI = null;

    this._init();
  }

  setWorld(world) {
    this._simulationUI.setWorld(world);
  }

  update() {
    this._simulationUI.update();
  }

  onCellSelected(cell) {
    this._simulationUI.onCellSelected(cell);
  }

  _init() {
    this._initServices();
    this._initHeader();
    this._initSimulationUI();
    this._initMainScreenUI();
    this._setupEvents();
  }

  _initServices() {
    this.DI
      .register('genomeLibrary', new GenomeLibraryService())
      .register('importExport', new ImportExportService());
  }

  _initHeader() {
    const navHeader = this._header = this.create
      .template('nav-header')
      .addTo(this);

    this._simulationControls = this.create
      .custom('simulation-controls', SimulationControls)
      .injectTo(navHeader)
      .makeInvisible();
  }

  _initSimulationUI() {
    this._simulationUI = this.create
      .custom('simulation-ui', SimulationUI)
      .hide()
      .addTo(this);
  }

  _initMainScreenUI() {
    this._mainScreenUI = this.create
      .custom('main-screen', MainScreenUI)
      .addTo(this);
  }

  _setupEvents() {
    const controls = this._simulationControls;
    const simulationUI = this._simulationUI;
    const mainScreenUI = this._mainScreenUI;

    controls.onPlay.add(() => this.onPlay.post());
    controls.onPause.add(() => this.onPause.post());
    controls.onStop.add(() => {
      this.onStop.post();
      simulationUI.hide();
      controls.makeInvisible();
      mainScreenUI
        .reset()
        .show();
    });
    controls.onSpeedChanged.add((speed) => this.onSpeedChanged.post(speed));

    simulationUI.onZoomChanged.add((zoom) => this.onZoomChanged.post(zoom));
    simulationUI.onCellDeselected.add(() => this.onCellDeselected.post());

    mainScreenUI.onSimulationStart.add((config) => {
      mainScreenUI.hide();
      simulationUI
        .reset()
        .show();
      controls
        .pause(true)
        .show();
      this.onSimulationStart.post(config);
    })
  }
}
