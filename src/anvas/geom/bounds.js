import Math2 from '../utils/math2.js';
import Rect from './rect.js';
import Vec2 from './vec2.js';

export default class Bounds {
  constructor(minX, minY, maxX, maxY) {
    if (minX === undefined) {
      this.minX = Infinity;
      this.minY = Infinity;
      this.maxX = -Infinity;
      this.maxY = -Infinity;
    } else {
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    }
  }

  get width() {
    return this.maxX - this.minX;
  }

  get height() {
    return this.maxY - this.minY;
  }

  set width(value) {
    this.maxX = this.minX + value;
  }

  set height(value) {
    this.maxY = this.minY + value;
  }

  get position() {
    return new Vec2(this.minX, this.minY);
  }

  set position(vec) {
    const minX = this.minX;
    const minY = this.minY;
    const maxX = this.maxX;
    const maxY = this.maxY;

    const offsetX = vec.x - minX;
    const offsetY = vec.y - minY;

    this.minX = minX + offsetX;
    this.maxX = maxX + offsetX;
    this.minY = minY + offsetY;
    this.maxY = maxY + offsetY;
  }

  containsXY(x, y) {
    return (
      x >= this.minX &&
      x <= this.maxX &&
      y >= this.minY &&
      y <= this.maxY
    );
  }

  contains(vec) {
    const x = vec.x;
    const y = vec.y;

    return (
      x >= this.minX &&
      x <= this.maxX &&
      y >= this.minY &&
      y <= this.maxY
    );
  }

  containsBounds(bounds) {
    return !(
      this.minX > bounds.minX ||
      this.maxX < bounds.maxX ||
      this.minY > bounds.minY ||
      this.maxY < bounds.maxY
    );
  }

  intersects(b) {
    return !(
      b.minX > this.maxX ||
      b.maxX < this.minX ||
      b.minY > this.maxY ||
      b.maxY < this.minY
    );
  }

  intersectsRaw(minX, maxX, minY, maxY) {
    return !(
      minX > this.maxX ||
      maxX < this.minX ||
      minY > this.maxY ||
      maxY < this.minY
    );
  }

  intersection(bounds, destination) {
    const result = (destination === undefined ? new Bounds() : destination);

    result.minX = Math2.max(this.minX, bounds.minX);
    result.maxX = Math2.min(this.maxX, bounds.maxX);
    result.minY = Math2.max(this.minY, bounds.minY);
    result.maxY = Math2.min(this.maxY, bounds.maxY);

    return result;
  }

  translate(x, y) {
    this.minX += x;
    this.minY += y;
    this.maxX += x;
    this.maxY += y;

    return this;
  }

  scale(factor) {
    this.minX *= factor;
    this.minY *= factor;
    this.maxX *= factor;
    this.maxY *= factor;

    return this;
  }

  set(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;

    return this;
  }

  reset() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;

    return this;
  }

  isReset() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }

  copyFrom(r) {
    this.minX = r.minX;
    this.minY = r.minY;
    this.maxX = r.maxX;
    this.maxY = r.maxY;

    return this;
  }

  copyTo(r) {
    r.minX = this.minX;
    r.minY = this.minY;
    r.maxX = this.maxX;
    r.maxY = this.maxY;

    return this;
  }

  clone() {
    return new Bounds().copyFrom(this);
  }

  equals(r) {
    return (
      this.minX === r.minX &&
      this.minY === r.minY &&
      this.maxX === r.maxX &&
      this.maxY === r.maxY
    );
  }

  equalsEps(r, eps) {
    return (
      Math2.abs(this.minX - r.minX) <= eps &&
      Math2.abs(this.minY - r.minY) <= eps &&
      Math2.abs(this.maxX - r.maxX) <= eps &&
      Math2.abs(this.maxY - r.maxY) <= eps
    );
  }

  addBounds(b) {
    this.minX = Math2.min(this.minX, b.minX);
    this.minY = Math2.min(this.minY, b.minY);
    this.maxX = Math2.max(this.maxX, b.maxX);
    this.maxY = Math2.max(this.maxY, b.maxY);

    return this;
  }

  addRect(r) {
    this.minX = Math2.min(this.minX, r.left);
    this.minY = Math2.min(this.minY, r.top);
    this.maxX = Math2.max(this.maxX, r.right);
    this.maxY = Math2.max(this.maxY, r.bottom);

    return this;
  }

  addVec2(v) {
    this.minX = Math2.min(this.minX, v.x);
    this.minY = Math2.min(this.minY, v.x);
    this.maxX = Math2.max(this.maxX, v.y);
    this.maxY = Math2.max(this.maxY, v.y);

    return this;
  }

  clampVec(vec) {
    return new Vec2(
      Math2.max(this.minX, Math2.min(this.maxX, vec.x)),
      Math2.max(this.minY, Math2.min(this.maxY, vec.y))
    );
  }

  roundUp() {
    this.minX = Math.floor(this.minX);
    this.minY = Math.floor(this.minY);
    this.maxX = Math.ceil(this.maxX);
    this.maxY = Math.ceil(this.maxY);

    return this;
  }

  toRect() {
    return new Rect(this.minX, this.minY, this.width, this.height);
  }

  toString() {
    return `(${this.minX};${this.minY}) (${this.maxX};${this.maxY})`;
  }

  hash() {
    return ~~(
      this.minX * this.minY + this.maxX * this.maxY +
      this.minX + this.minY + this.maxX + this.maxY
    );
  }
}

Bounds.temp = new Bounds();
