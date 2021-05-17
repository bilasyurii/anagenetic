import SU from "../anvas/screen/screen-utils";

export default class NavigationController {
  constructor(engine, world) {
    this.engine = engine;
    this.input = engine.input;
    this.world = world;
    this.worldView = world.view;

    this._isDragging = false;
    this._zoom = 1;

    this._setupView();
    this._setupEvents();
  }

  setZoom(zoom) {
    this._zoom = zoom;
    this.worldView.scale.set(1 / zoom);

    return this;
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
