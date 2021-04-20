import Collider from './collider.js';
import Vec2 from '../../geom/vec2.js';
import Math2 from '../../utils/math2.js';
import ObservableVec2 from '../../geom/observable-vec2.js';

export default class AABBCollider extends Collider {
  constructor(halfSize, offset) {
    super(offset);

    this.isAABB = true;

    this.halfSize = new ObservableVec2(this._onBoundsDirty, this, 100, 100);

    if (halfSize !== undefined) {
      this.halfSize.copyFrom(halfSize);
    }
  }

  clampVec(vec) {
    const position = this.position;
    const x = position.x;
    const y = position.y;

    const halfSize = this.halfSize;
    const hw = halfSize.x;
    const hh = halfSize.y;

    return new Vec2(
      Math2.max(x - hw, Math2.min(x + hw, vec.x)),
      Math2.max(y - hh, Math2.min(y + hh, vec.y))
    );
  }

  _updateBounds() {
    const position = this.position;
    const halfSize = this.halfSize;

    this._bounds.set(
      position.x - halfSize.x,
      position.y - halfSize.y,
      position.x + halfSize.x,
      position.y + halfSize.y
    );
  }
}
