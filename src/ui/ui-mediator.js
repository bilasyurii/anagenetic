export default class UIMediator {
  constructor() {
    this._ui = null;
    this._simulation = null;
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

  _setupEvents() {
    const simulation = this._simulation;

    simulation.onCellSelected.add(this._onCellSelected, this);
  }

  _onCellSelected(cell) {
    this._ui.onCellSelected(cell);
  }
}

UIMediator._instance = new UIMediator();
