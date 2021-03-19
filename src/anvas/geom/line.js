import Math2 from '../utils/math2.js';
import Vec2 from './vec2.js';

export default class Line {
  constructor(startX, startY, endX, endY) {
    this.start = new Vec2(startX, startY);
    this.end = new Vec2(endX, endY);
  }

  setStart(x, y) {
    this.start.set(x, y);

    return this;
  }

  setEnd(x, y) {
    this.end.set(x, y);

    return this;
  }

  set(startX, startY, endX, endY) {
    this.start.set(startX, startY);
    this.end.set(endX, endY);

    return this;
  }

  get length() {
    return this.end.distance(this.start);
  }

  get lengthSqr() {
    return this.end.distanceSqr(this.start);
  }

  get width() {
    return Math2.abs(this.end.x - this.start.x);
  }

  get height() {
    return Math2.abs(this.end.y - this.start.y);
  }

  get direction() {
    return this.end.clone().subVec(this.start);
  }

  static contains(vec) {
    const direction = this.direction;
    const end = this.end;

    if (direction.x === 0) {
      return Math2.zero(vec.x, end.x);
    }

    const slope = direction.y / direction.x;
    const intercept = end.y - slope * end.x;

    return Math2.zero(vec.y - intercept + slope * vec.x);
  }
}
