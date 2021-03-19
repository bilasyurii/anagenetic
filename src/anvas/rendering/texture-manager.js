import Texture from './texture.js';
import Debug from '../debug/debug.js';

const defaultTextureNamePrefix = 'unnamed_1256_';

export default class TextureManager {
  constructor() {
    this._textures = {};
    this._lastFreeIndex = -1;
  }

  create(key, source, width, height) {
    if (key === undefined) {
      key = this._getFreeName();
    }

    const texture = new Texture(this, key, source, width, height);

    this._textures[key] = texture;

    return texture;
  }

  remove(key) {
    const texture = this.has(key);

    if (texture === undefined) {
      console.warn('Missing texture with key: ' + key);
    } else {
      delete this._textures[key];

      texture.destroy();

      return true;
    }

    return false;
  }

  has(key) {
    return this._textures[key];
  }

  get(key) {
    const texture = this._textures[key];

    if (texture === undefined) {
      console.warn(`Missing texture with name ` + key);
    }

    return texture;
  }

  rename(oldKey, newKey) {
    const textures = this._textures;
    const texture = textures[oldKey];

    if (texture === undefined) {
      Debug.fail(`Missing texture with name ` + key);
    } else {

      if (textures[newKey] !== undefined) {
        textures[newKey] = texture;

        delete textures[oldKey];
      } else {
        Debug.fail(`Renaming texture failed: texture with name ${newKey} is already present.`);
      }
    }
  }

  getKeys() {
    const keys = [];
    const textures = this._textures;

    for (const key in textures) {
      keys.push(key);
    }

    return keys;
  }

  forEach(callback, context) {
    const textures = this._textures;

    for (const key in textures) {
      callback.call(context, textures[key]);
    }

    return this;
  }

  findFrame(frameName) {
    const textures = this._textures;

    for (const key in textures) {
      const texture = textures[key];
      const frame = texture.has(frameName);

      if (frame !== undefined) {
        return {
          texture: texture,
          frame: frame,
        };
      }
    }

    return null;
  }

  destroy() {
    const textures = this._textures;

    for (const key in textures) {
      textures[key].destroy();
    }
  }

  _getFreeName() {
    const textures = this._textures;
    let freeIndex = this._lastFreeIndex + 1;

    while (true) {
      const name = defaultTextureNamePrefix + freeIndex;
      const texture = textures[name];

      if (texture === undefined) {
        this._lastFreeIndex = freeIndex;

        return name;
      } else {
        ++freeIndex;
      }
    }
  }
}
