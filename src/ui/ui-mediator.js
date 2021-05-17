import NavigationController from "../utils/navigation-controller";

export default class UIMediator {
  constructor() {
    this._ui = null;
    this._simulation = null;
    this._navigationController = null;
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

  _initNavigation() {
    const simulation = this._simulation;

    this._navigationController = new NavigationController(
      simulation.engine,
      simulation.world
    );
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
  }

  _onCellSelected(cell) {
    this._ui.onCellSelected(cell);
  }

  _onUpdate() {
    this._ui.update();
  }
}

UIMediator._instance = new UIMediator();
