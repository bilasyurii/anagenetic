import SU from '../anvas/screen/screen-utils';

export default class NavigationController {
  constructor(engine, world) {
    this.engine = engine;
    this.input = engine.input;
    this.world = world;
    this.worldView = world.view;

    this._inputEnabled = true;
    this._isDragging = false;
    this._zoom = 1;
    this._lockedCellBody = null;

    this._setupView();
    this._setupEvents();
  }

  lockOnCell(cell) {
    this._lockedCellBody = cell.view.rigidBody;

    return this;
  }

  unlockCell() {
    this._lockedCellBody = null;

    return this;
  }

  setInputEnabled(value) {
    this._inputEnabled = value;
    this._isDragging = false;

    return this;
  }

  setZoom(zoom) {
    this._zoom = zoom;
    this.worldView.scale.set(1 / zoom);

    return this;
  }

  update() {
    const lockedCellBody = this._lockedCellBody;

    if (lockedCellBody === null) {
      return;
    }

    const view = this.worldView;

    view.pivot
      .copyFrom(lockedCellBody.position);
  }

  _setupView() {
    const world = this.world;
    const view = this.worldView;

    view.pivot
      .copyFrom(world.size)
      .mul(0.5);
    
    view.position
      .copyFrom(SU.center)
  }

  _setupEvents() {
    const input = this.input;

    input.onDown.add(this._onDown, this);
    input.onUp.add(this._onUp, this);
    input.onMove.add(this._onMove, this);
  }

  _onDown() {
    if (this._inputEnabled === false) {
      return;
    }

    this._isDragging = true;
  }

  _onUp() {
    this._isDragging = false;
  }

  _onMove() {
    if (this._isDragging === true) {
      const input = this.input;
      const zoom = this._zoom;

      this.worldView.pivot
        .sub(input.movementX * zoom, input.movementY * zoom);
    }
  }
}
