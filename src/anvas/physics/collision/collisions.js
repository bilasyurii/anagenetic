import Debug from '../../debug/debug.js';
import Bounds from '../../geom/bounds.js';
import Vec2 from '../../geom/vec2.js';

export default class Collisions {
  constructor() {
    Debug.staticClass();
  }

  static circle2collider(ci, co) {
    const position = co.position;
    const x = position.x;
    const y = position.y;

    if (co.isCircle === true) {
      return Collisions.circle2circle(ci.x, ci.y, ci.radius, x, y, co.radius);
    } else if (co.isAABB === true) {
      const halfSize = co.halfSize;
      const hw = halfSize.x;
      const hh = halfSize.y;
      const bounds = Bounds.temp
        .set(
          x - hw,
          y - hh,
          x + hw,
          y + hh,
        );

      return Collisions.circle2Bounds(ci, bounds);
    } else {
      Debug.fail('Unknown collider');
    }
  }

  static circle2circle(aX, aY, aR, bX, bY, bR) {
    const dx = bX - aX;
    const dy = bY - aY;
    const radiuses = aR + bR;

    return ((dx * dx + dy * dy) - radiuses * radiuses <= 0);
  }

  static circle2Bounds(c, b) {
    const circlePos = Vec2.temp.set(c.x, c.y);
    const closest = b.clampVec(circlePos);
    const direction = closest.subVec(circlePos);
    const radius = c.radius;

    return direction.lengthSqr < radius * radius;
  }
}
