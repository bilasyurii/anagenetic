export default class Cache {
  constructor(engine) {
    this.engine = engine;

    this._images = {};
  }

  checkImage(key) {
    return this._images[key] !== undefined;
  }

  getImage(key) {
    const image = this._images[key];

    if (image === undefined) {
      console.warn(`Missing image in cache: ` + key);
    }

    return image;
  }

  addImage(key, image) {
    const images = this._images;

    images[key] = image;

    return this;
  }

  removeImage(key) {
    const images = this._images;

    if (images[key] === undefined) {
      console.warn(`Missing image in cache: ` + key);

      return false;
    }

    delete images[key];

    return true;
  }
}
