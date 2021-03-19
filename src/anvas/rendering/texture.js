import CanvasPool from './canvas-pool.js';
import Rect from '../geom/rect.js';

export default class Texture {
  constructor(manager, name, source, width, height) {
    this.source = source;
    this.isCanvas = (source instanceof HTMLCanvasElement);

    if (this.isCanvas === true) {
      this.ctx = source.getContext('2d');
    }

    this._manager = manager;
    this._name = name;
    this._width = width;
    this._height = height;
    this._defaultFrame = new Rect(0, 0, this._width, this._height);

    this._frames = {};
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._manager.rename(this._name, value);
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get defaultFrame() {
    return this._defaultFrame;
  }

  add(key, frame) {
    this._frames[key] = frame;

    return this;
  }

  remove(key) {
    if (this.has(key) !== undefined) {
      delete this._frames[key];

      return true;
    }

    return false;
  }

  has(key) {
    return this._frames[key];
  }

  get(key) {
    const frame = this._frames[key];

    if (frame === undefined) {
      console.warn(`Missing frame key: ` + key);
    }

    return frame;
  }

  getKeys() {
    const keys = [];
    const frames = this._frames;

    for (const key in frames) {
      keys.push(key);
    }

    return keys;
  }

  destroy() {
    if (this.isCanvas === true) {
      CanvasPool.release(this.source);
    }
  }
}
