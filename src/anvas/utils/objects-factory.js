import Sprite from '../game-objects/sprite.js';
import Bitmap from '../rendering/bitmap.js';
import CanvasPool from '../rendering/canvas-pool.js';

export default class ObjectsFactory {
  constructor(engine) {
    this.engine = engine;

    this._textures = engine.textures;
  }

  sprite(frameName) {
    if (frameName.isBitmap === true) {
      return new Sprite(frameName);
    }

    const data = this._textures.findFrame(frameName);

    if (data === null) {
      const texture = this._textures.get(frameName);

      if (texture === undefined) {
        // TODO assign special error image
        return new Sprite();
      } else {
        return new Sprite(texture);
      }
    } else {
      return new Sprite(data.texture, frameName, data.frame);
    }
  }

  bitmap(width, height, key = undefined) {
    const canvas = CanvasPool.create(width, height);
    const texture = this._textures.create(key, canvas, width, height);

    return new Bitmap(texture);
  }
}
