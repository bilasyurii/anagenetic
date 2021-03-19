import Debug from '../debug/debug.js';

export default class Bitmap {
  constructor(texture) {
    Debug.assert(texture.isCanvas);

    this.texture = texture;
    this.ctx = texture.ctx;
    this.isBitmap = true;

    this._canvas = texture.source;
    this._width = texture.width;
    this._height = texture.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this._width, this._height);
  }

  rect(x, y, width, height, fill) {
    const ctx = this.ctx;

    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
  }
}

Bitmap.prototype.cls = Bitmap.prototype.clear;
