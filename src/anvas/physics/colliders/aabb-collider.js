import Collider from './collider.js';
import Vec2 from '../../geom/vec2.js';
import Math2 from '../../utils/math2.js';

export default class AABBCollider extends Collider {
  constructor(halfSize, offset) {
    super(offset);

    this.halfSize = (halfSize === undefined ? new Vec2(100, 100) : halfSize);
    this.isAABB = true;
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
}
