import NavigationController from '../utils/navigation-controller';

export default class UIMediator {
  constructor() {
    this._ui = null;
    this._simulation = null;
    this._navigationController = null;
  }

  setup() {
    const world = this._simulation.world;

    this._navigationController.setup(world);
    this._ui.setWorld(world);

    return this;
  }

  setSimulation(simulation) {
    this._simulation = simulation;

    return this;
  }

  setUI(ui) {
    this._ui = ui;

    return this;
  }

  init() {
    if (this._ui === null) {
      return;
    }

    if (this._simulation === null) {
      return;
    }

    this._initNavigation();
    this._setupEvents();
  }

  static registerSimulation(simulation) {
    UIMediator._instance
      .setSimulation(simulation)
      .init();
  }

  static registerUI(ui) {
    UIMediator._instance
      .setUI(ui)
      .init();
  }

  static setup() {
    UIMediator._instance.setup();
  }

  _initNavigation() {
    const simulation = this._simulation;

    this._navigationController = new NavigationController(simulation.engine);
  }

  _setupEvents() {
    const simulation = this._simulation;

    simulation.onCellSelected.add(this._onCellSelected, this);
    simulation.onUpdate.add(this._onUpdate, this);

    const ui = this._ui;
    const navigation = this._navigationController;

    ui.onPlay.add(() => simulation.play());
    ui.onPause.add(() => simulation.pause());
    ui.onStop.add(() => simulation.stop());
    ui.onSpeedChanged.add((speed) => simulation.changeSpeed(speed));
    ui.onZoomChanged.add((zoom) => navigation.setZoom(zoom));
    ui.onCellDeselected.add(this._onCellDeselected, this);
    ui.onSimulationStart.add((config) => simulation.start(config));
  }

  _onCellSelected(cell) {
    this._ui.onCellSelected(cell);
    this._navigationController
      .lockOnCell(cell)
      .setInputEnabled(false);
  }

  _onCellDeselected() {
    this._simulation.deselectCell();
    this._navigationController
      .unlockCell()
      .setInputEnabled(true);
  }

  _onUpdate() {
    this._ui.update();
    this._navigationController.update();
  }
}

UIMediator._instance = new UIMediator();
