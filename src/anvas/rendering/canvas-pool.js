import Debug from '../debug/debug.js';
import Pool from '../utils/pool.js';

export default class CanvasPool {
  constructor() {
    Debug.staticClass();
  }

  static init(startingAmount) {
    let pool = CanvasPool._pool;

    if (pool === null) {
      pool = CanvasPool._pool = new Pool(CanvasPool._createCanvas, true);

      pool.populate(startingAmount);
    }
  }

  static create(width, height) {
    const canvas = CanvasPool._pool.get();

    canvas.width = width || 1;
    canvas.height = height || 1;

    return canvas;
  }

  static release(canvas) {
    CanvasPool.release(canvas);
  }

  static _createCanvas() {
    return document.createElement('canvas');
  }
}

CanvasPool._pool = null;
