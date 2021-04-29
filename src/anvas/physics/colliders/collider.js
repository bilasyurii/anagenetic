import Debug from '../../debug/debug.js';
import Bounds from '../../geom/bounds.js';
import ObservableVec2 from '../../geom/observable-vec2.js';

export default class Collider {
  constructor(offset) {
    this.position = new ObservableVec2(this._onBoundsDirty, this, 0, 0);
    this.offset = new ObservableVec2(this._onBoundsDirty, this, 0, 0);

    if (offset !== undefined) {
      this.offset.copyFrom(offset);
    }

    this._bounds = new Bounds();
    this._dirtyBounds = true;
  }

  updateTransform(position) {
    this.position.copyFrom(position).addVec(this.offset);
  }

  getBounds() {
    if (this._dirtyBounds === true) {
      this._updateBounds();
      this._dirtyBounds = false;
    }

    return this._bounds;
  }

  _updateBounds() {
    Debug.abstractMethod();
  }

  _onBoundsDirty() {
    this._dirtyBounds = true;
  }
}
