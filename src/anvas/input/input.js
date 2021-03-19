import Observable from '../events/observable.js';
import Touch from './touch.js';
import Mouse from './mouse.js';
import SU from '../screen/screen-utils.js';
import ArrayUtils from '../utils/array-utils.js';

export default class Input {
  constructor(engine) {
    this.engine = engine;

    this.touch = new Touch(engine);
    this.mouse = new Mouse(engine);

    this.onDown = new Observable();
    this.onUp = new Observable();
    this.onMove = new Observable();

    this.inputHandlers = [];

    this.realX = 0;
    this.realY = 0;

    this.x = 0;
    this.y = 0;

    this.prevX = 0;
    this.prevY = 0;

    this.movementX = 0;
    this.movementY = 0;

    this.event = null;

    this._canvas = engine.canvas;

    this._setupEvents();
  }

  add(handler) {
    this.inputHandlers.push(handler);
  }

  remove(handler) {
    ArrayUtils.removeByValue(this.inputHandlers, handler);
  }

  update() {
    const x = this.x;
    const y = this.y;

    const handlers = this.inputHandlers;
    const count = handlers.length;

    for (let i = 0; i < count; ++i) {
      const handler = handlers[i];

      if (handler !== undefined) {
        handler.update(x, y);
      }
    }
  }

  disableAll() {
    this.touch.enabled = false;
    this.mouse.enabled = false;
  }

  destroy() {
    this.mouse.destroy();
    this.touch.destroy();
    this.onDown.destroy();
    this.onUp.destroy();
    this.onMove.destroy();

    this.mouse = null;
    this.touch = null;
    this.onDown = null;
    this.onUp = null;
    this.onMove = null;

    this.inputHandlers = [];
  }

  _setupEvents() {
    const mouse = this.mouse;

    mouse.onDown.add(this._onDown, this);
    mouse.onUp.add(this._onUp, this);
    mouse.onMove.add(this._onMove, this);

    const touch = this.touch;

    touch.onTouchStart.add(this._onDown, this);
    touch.onTouchEnd.add(this._onUp, this);
    touch.onTouchMove.add(this._onMove, this);
  }

  _onDown(event) {
    this._handleEvent(event);

    const x = this.x;
    const y = this.y;

    const handlers = this.inputHandlers;
    const count = handlers.length;

    for (let i = 0; i < count; ++i) {
      const handler = handlers[i];

      if (handler !== undefined) {
        if (handler.handleDown(x, y) === true) {
          break;
        }
      }
    }

    this.onDown.post(x, y);
  }

  _onUp(event) {
    this._handleEvent(event);

    const x = this.x;
    const y = this.y;

    const handlers = this.inputHandlers;
    const count = handlers.length;

    for (let i = 0; i < count; ++i) {
      const handler = handlers[i];

      if (handler !== undefined) {
        handler.handleUp(x, y);
      }
    }

    this.onUp.post(x, y);
  }

  _onMove(event) {
    this._handleEvent(event);

    const x = this.x;
    const y = this.y;

    const handlers = this.inputHandlers;
    const count = handlers.length;

    for (let i = 0; i < count; ++i) {
      const handler = handlers[i];

      if (handler !== undefined) {
        handler.handleMove(x, y);
      }
    }

    this.onMove.post(x, y);
  }

  _handleEvent(event) {
    this.event = event;

    const prevX = this.prevX = this.x;
    const prevY = this.prevY = this.y;

    this.realX = event.offsetX;
    this.realY = event.offsetY;

    const scaleInv = SU.scaleInv;

    const x = this.x = this.realX * scaleInv;
    const y = this.y = this.realY * scaleInv;

    this.movementX = x - prevX;
    this.movementY = y - prevY;
  }
}
