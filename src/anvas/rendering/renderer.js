import SU from '../screen/screen-utils.js';

export default class Renderer {
  constructor(engine) {
    this.engine = engine;

    this._root = engine.root;
    this._ctx = engine.canvas.getContext('2d');
    this._width = SU.width;
    this._height = SU.height;
  }

  render() {
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._clear();
    this._renderRecursive(this._root, false);
  }

  _clear() {
    this._ctx.clearRect(0, 0, this._width, this._height);
  }

  _renderRecursive(object, dirty) {
    if (dirty |= object.dirty) {
      object.forceUpdateTransform();
    }

    if (object.render !== undefined && object.visible === true) {
      const t = object.worldTransform;

      this._ctx.setTransform(t.a, t.b, t.d, t.e, t.c, t.f);

      object.render(this._ctx);
    }

    const children = object.children;

    if (children !== undefined) {
      const count = children.length;

      for (let i = 0; i < count; ++i) {
        this._renderRecursive(children[i], dirty);
      }
    }
  }
}
