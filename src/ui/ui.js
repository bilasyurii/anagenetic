import '../../node_modules/milligram/dist/milligram.min.css';
import '../../css/font-awesome.css';
import '../../css/main.scss';
import $ from 'jquery';
import TemplateMaster from './template-master';
import UIFactory from './ui-factory';
import UIElement from './core/ui-element';
import SimulationControls from './controls/simulation-controls';
import SimulationUI from './simulation/simulation-ui';

export default class UI extends UIElement {
  constructor() {
    TemplateMaster.init();

    super(new UIFactory(), $('#uiRoot')[0]);

    this._header = null;
    this._simulationControls = null;
    this._simulationUI = null;

    this._init();
  }

  _init() {
    this._initHeader();
    this._initSimulationUI();
  }

  _initHeader() {
    const navHeader = this._header = this.create
      .template('nav-header')
      .addTo(this);

    const controls = this._simulationControls = this.create
      .custom('simulation-controls', SimulationControls)
      .injectTo(navHeader);

    controls.onPlay.add(() => console.log('play'));
    controls.onPause.add(() => console.log('pause'));
    controls.onStop.add(() => console.log('stop'));
    controls.onSpeedChanged.add((speed) => console.log('speed ' + speed));
  }

  _initSimulationUI() {
    this._simulationUI = new SimulationUI(this.create, this)
  }
}
