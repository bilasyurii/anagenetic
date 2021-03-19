import Math2 from '../utils/math2.js';
import Vec2 from './vec2.js';

export default class ObservableVec2 {
  constructor(callback, context, x, y) {
    this.callback = callback;
    this.context = context;

    if (x === undefined) {
      this._x = 0;
      this._y = 0;
    } else {
      this._x = x;
      this._y = (y === undefined ? x : y);
    }
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;

    this.callback.call(this.context);
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;

    this.callback.call(this.context);
  }

  onChange() {
    this.callback.call(this.context);
  }

  add(x, y) {
    this._x += x;
    this._y += y;

    this.callback.call(this.context);

    return this;
  }

  addVec(vec) {
    this._x += vec.x;
    this._y += vec.y;

    this.callback.call(this.context);

    return this;
  }

  sub(x, y) {
    this._x -= x;
    this._y -= y;

    this.callback.call(this.context);

    return this;
  }

  subVec(vec) {
    this._x -= vec.x;
    this._y -= vec.y;

    this.callback.call(this.context);

    return this;
  }

  mul(x, y) {
    this._x *= x;
    this._y *= (y === undefined ? x : y);

    this.callback.call(this.context);

    return this;
  }

  mulVec(vec) {
    this._x *= vec.x;
    this._y *= vec.y;

    this.callback.call(this.context);

    return this;
  }

  div(x, y) {
    this._x /= x;
    this._y /= (y === undefined ? x : y);

    this.callback.call(this.context);

    return this;
  }

  divVec(vec) {
    this._x /= vec.x;
    this._y /= vec.y;

    this.callback.call(this.context);

    return this;
  }

  get length() {
    const x = this._x;
    const y = this._y;

    return Math.sqrt(x * x + y * y);
  }

  get lengthSqr() {
    const x = this._x;
    const y = this._y;

    return x * x + y * y;
  }

  get manhattan() {
    return Math2.abs(this._x) + Math2.abs(this._y);
  }

  normalize() {
    const x = this._x;
    const y = this._y;
    const length = Math.sqrt(x * x + y * y);

    if (length === 0) {
      this._x = 1;
      this._y = 0;
    } else {
      this._x = x / length;
      this._y = y / length;
    }

    this.callback.call(this.context);

    return this;
  }

  normalized() {
    const x = this._x;
    const y = this._y;
    const length = Math.sqrt(x * x + y * y);

    if (length === 0) {
      return new Vec2(1, 0);
    } else {
      return new Vec2(x / length, y / length);
    }
  }

  negate() {
    this._x = -this._x;
    this._y = -this._y;

    this.callback.call(this.context);

    return this;
  }

  negated() {
    return new Vec2(-this._x, -this._y);
  }

  invert() {
    const x = this._x;
    const y = this._y;

    this._x = x === 0 ? 0 : 1 / x;
    this._y = y === 0 ? 0 : 1 / y;

    this.callback.call(this.context);

    return this;
  }

  inverted() {
    const x = this._x;
    const y = this._y;

    return new Vec2(x === 0 ? 0 : 1 / x, y === 0 ? 0 : 1 / y);
  }

  radians() {
    return Math.atan2(-this._y, -this._x) + Math.PI;
  }

  degrees() {
    return Math.atan2(-this._y, -this._x) * Math2.RAD2DEG + 180;
  }

  setRadians(value) {
    const length = this.length;
    const sin = Math.sin(value);
    const cos = Math.cos(value);

    this._x = cos * length;
    this._y = sin * length;

    this.callback.call(this.context);

    return this;
  }

  setDegrees(value) {
    value *= Math2.DEG2RAD;

    const length = this.length;
    const sin = Math.sin(value);
    const cos = Math.cos(value);

    this._x = cos * length;
    this._y = sin * length;

    this.callback.call(this.context);

    return this;
  }

  perpendicular() {
    return new Vec2(-this._y, this._x);
  }

  copyTo(vec) {
    vec.set(this._x, this._y);

    return this;
  }

  copyFrom(vec) {
    this._x = vec.x;
    this._y = vec.y;

    this.callback.call(this.context);

    return this;
  }

  set(x, y) {
    if (x === undefined) {
      this._x = 0;
      this._y = 0;
    } else {
      this._x = x;
      this._y = (y === undefined ? x : y);
    }

    this.callback.call(this.context);

    return this;
  }

  setX(x) {
    this._x = x;

    this.callback.call(this.context);

    return this;
  }

  setY(y) {
    this._y = y;

    this.callback.call(this.context);

    return this;
  }

  setZero() {
    this._x = this._y = 0;

    this.callback.call(this.context);

    return this;
  }

  setFromRadians(angle, length) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    this._x = cos * length;
    this._y = sin * length;

    this.callback.call(this.context);

    return this;
  }

  setFromDegrees(angle, length) {
    angle *= Math2.DEG2RAD;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    this._x = cos * length;
    this._y = sin * length;

    this.callback.call(this.context);

    return this;
  }

  angleTo(vec) {
    const x = this._x;
    const y = this._y;
  
    return Math.atan2(y * vec.x - x * vec.y, x * vec.x + y * vec.y);
  }

  angleToDeg(vec) {
    const x = this._x;
    const y = this._y;

    return Math.atan2(y * vec.x - x * vec.y, x * vec.x + y * vec.y) * Math2.Rad2Deg;
  }

  dot(vec) {
    return this._x * vec.x + this._y * vec.y;
  }

  cross(vec) {
    return this._x * vec.y - this._y * vec.x;
  }

  get isZero() {
    return this._x === 0 && this._y === 0;
  }

  clone(callback, context) {
    if (callback === undefined) {
      callback = this.callback;
    }

    if (context === undefined) {
      context = this.context;
    }

    return new ObservableVec2(callback, context, this._x, this._y);
  }

  distance(vec) {
    const dX = vec.x - this._x;
    const dY = vec.y - this._y;

    return Math.sqrt(dX * dX + dY * dY);
  }

  distanceSqr(vec) {
    const dX = vec.x - this._x;
    const dY = vec.y - this._y;

    return dX * dX + dY * dY;
  }

  manhattanDistance(vec) {
    return Math2.abs(vec.x - this._x) + Math2.abs(vec.y - this._y);
  }

  rotate(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const x = _x;
    const y = _y;

    this._x = x * cos + y * sin;
    this._y = y * cos - x * sin;

    this.callback.call(this.context);

    return this;
  }

  rotated(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const x = _x;
    const y = _y;

    return new Vec2(
      x * cos + y * sin,
      y * cos - x * sin
    );
  }

  rotateAround(center, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const dirX = this._x - center.x;
    const dirY = this._y - center.y;

    this._x = dirX * cos + dirY * sin + center.x;
    this._y = dirY * cos - dirX * sin + center.y;

    this.callback.call(this.context);

    return this;
  }

  rotateAroundThis(point, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const x = this._x;
    const y = this._y;

    const dirX = point.x - x;
    const dirY = point.y - y;

    point.set(
      dirX * cos + dirY * sin + x,
      dirY * cos - dirX * sin + y
    );

    return point;
  }

  lerp(to, time) {
    const x = this._x;
    const y = this._y;

    this._x = x + (to.x - x) * time;
    this._y = y + (to.y - y) * time;

    this.callback.call(this.context);

    return this;
  }

  clamp(min, max) {
    this._x = Math2.max(min, Math2.min(max, this._x));
    this._y = Math2.max(min, Math2.min(max, this._y));

    this.callback.call(this.context);

    return this;
  }

  clamp2(minVec, maxVec) {
    this._x = Math2.max(minVec.x, Math2.min(maxVec.x, this._x));
    this._y = Math2.max(minVec.y, Math2.min(maxVec.y, this._y));

    this.callback.call(this.context);

    return this;
  }

  clampLength(min, max) {
    const currentLength = this.length;

    this.normalize();
    this.mul(Math2.max(min, Math2.min(max, currentLength)));

    return this;
  }

  floor() {
    this._x = Math.floor(this._x);
    this._y = Math.floor(this._y);

    this.callback.call(this.context);

    return this;
  }

  ceil() {
    this._x = Math.ceil(this._x);
    this._y = Math.ceil(this._y);

    this.callback.call(this.context);

    return this;
  }

  round() {
    this._x = Math.round(this._x);
    this._y = Math.round(this._y);

    this.callback.call(this.context);

    return this;
  }

  equals(vec) {
    return this._x === vec.x && this._y === vec.y;
  }

  equalsEps(vec, eps) {
    return (
      Math2.abs(this._x - vec.x) <= eps &&
      Math2.abs(this._y - vec.y) <= eps
    );
  }

  toString() {
    return this._x + ' ' + this._y;
  }

  hash() {
    const x = this._x;
    const y = this._y;

    return ~~(x * y + x + y);
  }

  destroy() {
    this.callback = null;
    this.context = null;
  }
}
