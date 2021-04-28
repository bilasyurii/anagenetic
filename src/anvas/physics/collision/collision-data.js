import Debug from '../../debug/debug.js';
import Vec2 from '../../geom/vec2.js';
import Math2 from '../../utils/math2.js';

export default class CollisionData {
  constructor(normal, depth) {
    if (normal === undefined) {
      this._normal = new Vec2();
      this._depth = 0;
      this._isColliding = false;
    } else {
      this._normal = normal;
      this._depth = depth;
      this._isColliding = true;
    }

    this._contacts = [];
  }

  get isColliding() {
    return this._isColliding;
  }

  get normal() {
    return this._normal;
  }

  get depth() {
    return this._depth;
  }

  get contacts() {
    return this._contacts;
  }

  addContact(contact) {
    this._contacts.push(contact);

    return this;
  }

  static getFromColliders(a, b) {
    if (a.isCircle === true) {
      if (b.isCircle === true) {
        return CollisionData.circle2circle(a, b);
      } else if (b.isAABB === true) {
        return CollisionData.circle2AABB(a, b, false);
      } else {
        Debug.fail('Unknown collider');
      }
    } else if (a.isAABB === true) {
      if (b.isCircle === true) {
        return CollisionData.circle2AABB(b, a, true);
      } else {
        Debug.fail('Unknown collider');
      }
    } else {
      Debug.fail('Unknown collider');
    }
  }

  static circle2circle(a, b) {
    const aR = a.radius;
    const aPos = a.position;
    const aX = aPos.x;
    const aY = aPos.y;
    const radiuses = aR + b.radius;
    const bPos = b.position;
    const dx = bPos.x - aX;
    const dy = bPos.y - aY;
    const distanceSqr = dx * dx + dy * dy;

    if (distanceSqr - radiuses * radiuses > 0) {
      return new CollisionData();
    }

    const distance = Math.sqrt(distanceSqr);

    if (distance === 0) {
      return new CollisionData(new Vec2(1, 0), aR)
        .addContact(aPos.clone());
    }

    const depth = Math2.abs(distance - radiuses) * 0.5;
    const distanceInv = 1 / distance;
    const normal = new Vec2(dx * distanceInv, dy * distanceInv);
    const distanceToPoint = aR - depth;
    const contact = new Vec2(aX, aY)
      .add(normal.x * distanceToPoint, normal.y * distanceToPoint);

    return new CollisionData(normal, depth)
      .addContact(contact);
  }

  static circle2AABB(c, b, negate) {
    const circlePos = c.position;
    const closest = b.clampVec(circlePos);
    const direction = closest.clone().subVec(circlePos);
    const depthSqr = direction.lengthSqr;

    if (depthSqr >= c.radiusSqr) {
      return new CollisionData();
    }

    let depth;

    if (depthSqr === 0) {
      direction
        .copyFrom(b.position)
        .subVec(circlePos)
        .lengthSqr;

      depth = c.radius;
    } else {
      depth = Math.sqrt(depthSqr);
    }

    direction.normalize();

    if (negate === true) {
      direction.negate();
    }

    return new CollisionData(direction, depth)
      .addContact(closest);
  }
}
