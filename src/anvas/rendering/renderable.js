import Debug from '../debug/debug.js';
import GameObject from '../game-objects/game-object.js';

export default class Renderable extends GameObject {
  constructor() {
    super();

    this._visible = true;
    this._alpha = true;
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    this._visible = value;
  }

  get alpha() {
    return this._alpha;
  }

  set alpha(value) {
    this._alpha = value;
  }

  render(ctx) {
    Debug.abstractMethod();
  }
}
