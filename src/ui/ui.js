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

export default class UI extends UIElement {
  constructor() {
    TemplateMaster.init();

    super(new UIFactory(), $('#uiRoot')[0]);

    this.onPlay = new Observable();
    this.onPause = new Observable();
    this.onStop = new Observable();
    this.onSpeedChanged = new Observable();
    this.onZoomChanged = new Observable();
    this.onCellDeselected = new Observable();

    this._header = null;
    this._simulationControls = null;
    this._simulationUI = null;
    this._mainScreenUI = null;

    this._init();
  }

  update() {
    this._simulationUI.update();
  }

  onCellSelected(cell) {
    this._simulationUI.onCellSelected(cell);
  }

  _init() {
    this._initHeader();
    this._initSimulationUI();
    this._initMainScreenUI();
    this._setupEvents();
  }

  _initHeader() {
    const navHeader = this._header = this.create
      .template('nav-header')
      .addTo(this);

    this._simulationControls = this.create
      .custom('simulation-controls', SimulationControls)
      .injectTo(navHeader);
  }

  _initSimulationUI() {
    this._simulationUI = this.create
      .custom('simulation-ui', SimulationUI)
      .addTo(this);
  }

  _initMainScreenUI() {
    this._mainScreenUI = this.create
      .custom('main-screen', MainScreenUI)
      .addTo(this);
  }

  _setupEvents() {
    const controls = this._simulationControls;

    controls.onPlay.add(() => this.onPlay.post());
    controls.onPause.add(() => this.onPause.post());
    controls.onStop.add(() => this.onStop.post());
    controls.onSpeedChanged.add((speed) => this.onSpeedChanged.post(speed));

    const simulationUI = this._simulationUI;

    simulationUI.onZoomChanged.add((zoom) => this.onZoomChanged.post(zoom));
    simulationUI.onCellDeselected.add(() => this.onCellDeselected.post());
  }
}
