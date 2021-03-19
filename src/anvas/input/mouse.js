import Observable from '../events/observable.js';

export default class Mouse {
  constructor(engine) {
    this.engine = engine;

    this.enabled = true;

    this.onDown = new Observable();
    this.onUp = new Observable();
    this.onMove = new Observable();
    this.onOut = new Observable();
    this.onOver = new Observable();

    this.event = null;

    this._canvas = engine.canvas;

    this._setupEvents()
  }

  destroy() {
    this.onDown.destroy();
    this.onUp.destroy();
    this.onMove.destroy();
    this.onOut.destroy();
    this.onOver.destroy();

    this.onDown = null;
    this.onUp = null;
    this.onMove = null;
    this.onOut = null;
    this.onOver = null;
  }

  _setupEvents() {
    const canvas = this._canvas;

    canvas.addEventListener('mousedown', this._onMouseDown.bind(this), true);
    canvas.addEventListener('mouseup', this._onMouseUp.bind(this), true);
    canvas.addEventListener('mousemove', this._onMouseMove.bind(this), true);
    canvas.addEventListener('mouseout', this._onMouseOut.bind(this), true);
    canvas.addEventListener('mouseover', this._onMouseOver.bind(this), true);
  }

  _onMouseDown(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onDown.post(event);
  }

  _onMouseUp(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onUp.post(event);
  }

  _onMouseMove(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onMove.post(event);
  }

  _onMouseOut(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onOut.post(event);
  }

  _onMouseOver(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onOver.post(event);
  }
}
