import Renderable from '../rendering/renderable.js';

export default class Sprite extends Renderable {
  constructor(texture = null, frameName = null, frame = null) {
    super();

    if (texture.isBitmap === true) {
      texture = texture.texture;
    }

    this._texture = texture;

    if (texture === null || texture === undefined) {
      this._frameName = undefined;
      this._frame = undefined;
    } else if (frameName === null) {
      this._frameName = null;
      this._frame = texture.defaultFrame;
    } else {
      this._frameName = frameName;

      if (frame === null) {
        this._frame = texture.get(frameName);
      } else {
        this._frame = frame;
      }
    }

    this.calculateLocalBounds();
  }

  get texture() {
    return this._texture;
  }

  set texture(value) {
    if (this._texture === value) {
      return;
    }

    this._texture = value;
    this._frameName = undefined;

    if (value !== null && value !== undefined) {
      this._frame = value.defaultFrame;
    } else {
      this._frame = undefined;
    }

    this.calculateLocalBounds();
  }

  get frameName() {
    return this._frameName;
  }

  set frameName(value) {
    this._frameName = value;

    const texture = this._texture

    if (texture !== null && texture !== undefined) {
      this._frame = texture.get(value);
      this.calculateLocalBounds();
    }
  }

  get frame() {
    return this._frame.clone();
  }

  render(ctx) {
    const frame = this._frame;

    if (frame !== undefined) {
      const w = frame.w;
      const h = frame.h;
  
      ctx.drawImage(this._texture.source, frame.x, frame.y, w, h, 0, 0, w, h);
    } 
  }

  getBounds(matrix) {
    this.recursiveUpdateTransform();

    const frame = this._frame;

    const w = frame.width;
    const h = frame.height;

    let w0 = w;
    let w1 = 0;

    let h0 = h;
    let h1 = 0;

    const worldTransform = matrix || this._world;

    let a = worldTransform.a;
    let b = worldTransform.b;
    let c = worldTransform.c;
    let d = worldTransform.d;
    let e = worldTransform.e;
    let f = worldTransform.f;

    let minX = Infinity;
    let minY = Infinity;

    let maxX = -Infinity;
    let maxY = -Infinity;

    if (b === 0 && d === 0) {
      if (a < 0) {
        a = -a;
        w0 = 0;
        w1 = -w;
      }

      if (e < 0) {
        e = -e;
        h0 = 0;
        h1 = -h;
      }

      minX = a * w1 + c;
      maxX = a * w0 + c;
      minY = e * h1 + f;
      maxY = e * h0 + f;
    } else {
      const x1 = a * w1 + d * h1 + c;
      const y1 = e * h1 + b * w1 + f;

      const x2 = a * w0 + d * h1 + c;
      const y2 = e * h1 + b * w0 + f;

      const x3 = a * w0 + d * h0 + c;
      const y3 = e * h0 + b * w0 + f;

      const x4 =  a * w1 + d * h0 + c;
      const y4 =  e * h0 + b * w1 + f;

      minX = x1;
      minX = x2 < minX ? x2 : minX;
      minX = x3 < minX ? x3 : minX;
      minX = x4 < minX ? x4 : minX;

      minY = y1;
      minY = y2 < minY ? y2 : minY;
      minY = y3 < minY ? y3 : minY;
      minY = y4 < minY ? y4 : minY;

      maxX = x1;
      maxX = x2 > maxX ? x2 : maxX;
      maxX = x3 > maxX ? x3 : maxX;
      maxX = x4 > maxX ? x4 : maxX;

      maxY = y1;
      maxY = y2 > maxY ? y2 : maxY;
      maxY = y3 > maxY ? y3 : maxY;
      maxY = y4 > maxY ? y4 : maxY;
    }

    const bounds = this._worldBounds;

    bounds.minX = minX;
    bounds.minY = minY;
    bounds.maxX = maxX;
    bounds.maxY = maxY;

    return bounds;
  }

  calculateLocalBounds() {
    const bounds = this._localBounds;
    const frame = this._frame;

    if (frame === undefined) {
      bounds.reset();
    } else {
      bounds.set(0, 0, frame.w, frame.h);
    }
  }

  getLocalBounds() {
    return this._localBounds;
  }

  get width() {
    return this._localBounds.width * this.scale.x;
  }

  get height() {
    return this._localBounds.height * this.scale.x;
  }

  set width(value) {
    this.scale.x = value / this._localBounds.width;
  }

  set height(value) {
    this.scale.y = value / this._localBounds.height;
  }

  destroy() {
    this._texture = null;
    this._frame = null;
    this._frameName = null;
  }
}
