import Observable from '../events/observable.js';

export default class Touch {
  constructor(engine) {
    this.engine = engine;

    this.enabled = true;

    this.onTouchStart = new Observable();
    this.onTouchEnd = new Observable();
    this.onTouchMove = new Observable();
    this.onTouchLeave = new Observable();
    this.onTouchEnter = new Observable();

    this.event = null;

    this._canvas = engine.canvas;

    this._setupEvents()
  }

  destroy() {
    this.onTouchStart.destroy();
    this.onTouchEnd.destroy();
    this.onTouchMove.destroy();
    this.onTouchLeave.destroy();
    this.onTouchEnter.destroy();

    this.onTouchStart = null;
    this.onTouchEnd = null;
    this.onTouchMove = null;
    this.onTouchLeave = null;
    this.onTouchEnter = null;
  }

  _setupEvents() {
    const canvas = this._canvas;

    canvas.addEventListener('touchstart', this._onTouchStart.bind(this), true);
    canvas.addEventListener('touchend', this._onTouchEnd.bind(this), true);
    canvas.addEventListener('touchmove', this._onTouchMove.bind(this), true);
    canvas.addEventListener('touchleave', this._onTouchLeave.bind(this), true);
    canvas.addEventListener('touchenter', this._onTouchEnter.bind(this), true);
  }

  _onTouchStart(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onTouchStart.post(event);
  }

  _onTouchEnd(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onTouchEnd.post(event);
  }

  _onTouchMove(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onTouchMove.post(event);
  }

  _onTouchLeave(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onTouchLeave.post(event);
  }

  _onTouchEnter(event) {
    if (this.enabled === false) {
      return;
    }

    this.event = event;

    this.onTouchEnter.post(event);
  }
}
