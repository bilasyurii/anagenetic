export default class NavigationController {
  constructor(engine, worldView) {
    this.engine = engine;
    this.input = engine.input;
    this.worldView = worldView;

    this.isDragging = false;

    this._setupEvents();
  }

  _setupEvents() {
    const input = this.input;

    input.onDown.add(this._onDown, this);
    input.onUp.add(this._onUp, this);
    input.onMove.add(this._onMove, this);
  }

  _onDown() {
    this.isDragging = true;
  }

  _onUp() {
    this.isDragging = false;
  }

  _onMove() {
    if (this.isDragging === true) {
      const input = this.input;

      this.worldView.position.add(input.movementX, input.movementY);
    }
  }
}
