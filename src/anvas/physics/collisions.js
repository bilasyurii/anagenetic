import Debug from '../debug/debug.js';
import Vec2 from '../geom/vec2.js';
import Math2 from '../utils/math2.js';
import CollisionData from './collision-data.js';

export default class Collisions {
  constructor() {
    Debug.staticClass();
  }

  static checkCollision(a, b) {
    if (a.isCircle === true) {
      if (b.isCircle === true) {
        return Collisions.circle2circle(a, b);
      } else if (b.isAABB === true) {
        return Collisions.circle2AABB(a, b);
      } else {
        Debug.fail('Unknown collider');
      }
    } else if (a.isAABB === true) {
      if (b.isCircle === true) {
        return Collisions.circle2AABB(b, a);
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
    const depth = Math2.abs(distance - radiuses) * 0.5;
    const distanceInv = 1 / distance;
    const normal = new Vec2(dx * distanceInv, dy * distanceInv);
    const distanceToPoint = aR - depth;
    const contact = new Vec2(aX, aY)
      .add(normal.x * distanceToPoint, normal.y * distanceToPoint);

    return new CollisionData(normal, depth)
      .addContact(contact);
  }

  static circle2AABB(c, b) {
    const circlePos = c.position;
    const closest = b.clampVec(circlePos);
    const direction = closest.clone().subVec(circlePos);
    const depth = direction.length;

    if (depth >= c.radius) {
      return new CollisionData();
    }

    direction.normalize();

    return new CollisionData(direction, depth)
      .addContact(closest);
  }
}
