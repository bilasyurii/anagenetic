import Math2 from '../utils/math2.js';

export default class Vec2 {
  constructor(x, y) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x = x;
      this.y = (y === undefined ? x : y);
    }
  }

  add(x, y) {
    this.x += x;
    this.y += y;

    return this;
  }

  addVec(vec) {
    this.x += vec.x;
    this.y += vec.y;

    return this;
  }

  sub(x, y) {
    this.x -= x;
    this.y -= y;

    return this;
  }

  subVec(vec) {
    this.x -= vec.x;
    this.y -= vec.y;

    return this;
  }

  mul(x, y) {
    this.x *= x;
    this.y *= (y === undefined ? x : y);

    return this;
  }

  mulVec(vec) {
    this.x *= vec.x;
    this.y *= vec.y;

    return this;
  }

  div(x, y) {
    this.x /= x;
    this.y /= (y === undefined ? x : y);

    return this;
  }

  divVec(vec) {
    this.x /= vec.x;
    this.y /= vec.y;

    return this;
  }

  get length() {
    const x = this.x;
    const y = this.y;

    return Math.sqrt(x * x + y * y);
  }

  set length(value) {
    this.normalize();

    this.x *= value;
    this.y *= value;
  }

  get lengthSqr() {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }

  get manhattan() {
    return Math2.abs(this.x) + Math2.abs(this.y);
  }

  normalize() {
    const x = this.x;
    const y = this.y;
    const length = Math.sqrt(x * x + y * y);

    if (length === 0) {
      this.x = 1;
      this.y = 0;
    } else {
      this.x = x / length;
      this.y = y / length;
    }

    return this;
  }

  normalized() {
    const x = this.x;
    const y = this.y;
    const length = Math.sqrt(x * x + y * y);

    if (length === 0) {
      return new Vec2(1, 0);
    } else {
      return new Vec2(x / length, y / length);
    }
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  negated() {
    return new Vec2(-this.x, -this.y);
  }

  invert() {
    const x = this.x;
    const y = this.y;

    this.x = x === 0 ? 0 : 1 / x;
    this.y = y === 0 ? 0 : 1 / y;

    return this;
  }

  inverted() {
    const x = this.x;
    const y = this.y;

    return new Vec2(x === 0 ? 0 : 1 / x, y === 0 ? 0 : 1 / y);
  }

  radians() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }

  degrees() {
    return Math.atan2(-this.y, -this.x) * Math2.RAD2DEG + 180;
  }

  setRadians(value) {
    const length = this.length;
    const sin = Math.sin(value);
    const cos = Math.cos(value);

    this.x = cos * length;
    this.y = sin * length;

    return this;
  }

  setDegrees(value) {
    value *= Math2.DEG2RAD;

    const length = this.length;
    const sin = Math.sin(value);
    const cos = Math.cos(value);

    this.x = cos * length;
    this.y = sin * length;

    return this;
  }

  perpendicular() {
    return new Vec2(-this.y, this.x);
  }

  copyTo(vec) {
    vec.x = this.x;
    vec.y = this.y;

    return this;
  }

  copyFrom(vec) {
    this.x = vec.x;
    this.y = vec.y;

    return this;
  }

  set(x, y) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x = x;
      this.y = (y === undefined ? x: y);
    }

    return this;
  }

  setX(x) {
    this.x = x;

    return this;
  }

  setY(y) {
    this.y = y;

    return this;
  }

  setZero() {
    this.x = 0;
    this.y = 0;

    return this;
  }

  setFromRadians(angle, length) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    this.x = cos * length;
    this.y = sin * length;

    return this;
  }

  setFromDegrees(angle, length) {
    angle *= Math2.DEG2RAD;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    this.x = cos * length;
    this.y = sin * length;

    return this;
  }

  angleTo(vec) {
    const x = this.x;
    const y = this.y;

    return Math.atan2(
      y * vec.x - x * vec.y,
      x * vec.x + y * vec.y
    );
  }

  angleToDeg(vec) {
    const x = this.x;
    const y = this.y;

    return Math.atan2(
      y * vec.x - x * vec.y,
      x * vec.x + y * vec.y
    ) * Math2.Rad2Deg;
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  cross(vec) {
    return this.x * vec.y - this.y * vec.x;
  }

  get isZero() {
    return this.x === 0 && this.y === 0;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  distance(vec) {
    const dX = vec.x - this.x;
    const dY = vec.y - this.y;

    return Math.sqrt(dX * dX + dY * dY);
  }

  distanceSqr(vec) {
    const dX = vec.x - this.x;
    const dY = vec.y - this.y;

    return dX * dX + dY * dY;
  }

  manhattanDistance(vec) {
    return Math2.abs(vec.x - this.x) + Math2.abs(vec.y - this.y);
  }

  rotate(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const x = this.x;
    const y = this.y;

    this.x = x * cos + y * sin;
    this.y = y * cos - x * sin;

    return this;
  }

  rotated(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const x = this.x;
    const y = this.y;

    return new Vec2(
      x * cos + y * sin,
      y * cos - x * sin
    );
  }

  rotateAround(center, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const dirX = this.x - center.x;
    const dirY = this.y - center.y;

    this.x = dirX * cos + dirY * sin + center.x;
    this.y = dirY * cos - dirX * sin + center.y;

    return this;
  }

  rotateAroundThis(point, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const x = this.x;
    const y = this.y;

    const dirX = point.x - x;
    const dirY = point.y - y;

    point.x = dirX * cos + dirY * sin + x;
    point.y = dirY * cos - dirX * sin + y;

    return point;
  }

  lerp(to, time) {
    const x = this.x;
    const y = this.y;

    this.x = x + (to.x - x) * time;
    this.y = y + (to.y - y) * time;

    return this;
  }

  clamp(min, max) {
    this.x = Math2.max(min, Math2.min(max, this.x));
    this.y = Math2.max(min, Math2.min(max, this.y));

    return this;
  }

  clamp2(minVec, maxVec) {
    this.x = Math2.max(minVec.x, Math2.min(maxVec.x, this.x));
    this.y = Math2.max(minVec.y, Math2.min(maxVec.y, this.y));

    return this;
  }

  clampLength(min, max) {
    const currentLength = this.length;

    if (currentLength < min || currentLength > max) {
      this.normalize();
      this.mul(Math2.max(min, Math2.min(max, currentLength)));
    }

    return this;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  equals(vec) {
    return this.x === vec.x && this.y === vec.y;
  }

  equalsEps(vec, eps) {
    return (
      Math2.abs(this.x - vec.x) <= eps &&
      Math2.abs(this.y - vec.y) <= eps
    );
  }

  toString() {
    return this.x + ' ' + this.y;
  }

  hash() {
    const x = this.x;
    const y = this.y;

    return ~~(x * y + x + y);
  }

  static longer(a, b) {
    return (b.lengthSqr > a.lengthSqr) ? b : a;
  }

  static shorter(a, b) {
    return (b.lengthSqr < a.lengthSqr) ? b : a;
  }

  static fromRadians(angle, length) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Vec2(cos * length, sin * length);
  }

  static fromDegrees(angle, length) {
    angle *= Math2.RAD2DEG;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Vec2(cos * length, sin * length);
  }

  static lerp(a, b, time) {
    const aX = a.x;
    const aY = a.y;

    return new Vec2(aX + (b.x - aX) * time, aY + (b.y - aY) * time);
  }

  static angleBetween(a, b) {
    const dot = a.x * b.x + a.y * b.y;

    return Math.acos(dot / (a.length * b.length));
  }
}

Vec2.zero = new Vec2(0, 0);
Vec2.left = new Vec2(-1, 0);
Vec2.right = new Vec2(1, 0);
Vec2.up = new Vec2(0, -1);
Vec2.down = new Vec2(0, 1);
